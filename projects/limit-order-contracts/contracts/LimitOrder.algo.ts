import { Contract } from '@algorandfoundation/tealscript';

interface Order {
  id: uint64;
  owner: Address;
  givingAsset: uint64;
  takingAsset: uint64;
  givingAmount: uint64;
  takingAmount: uint64;
  completed: boolean;
  ownerClaimed: boolean;
}

const BOX_MBR = 35_300;

export class LimitOrder extends Contract {
  orderIndex = GlobalStateKey<uint64>({ key: 'orderIndex' });

  orders = BoxMap<uint64, Order>({});

  createApplication(): void {
    this.orderIndex.value = 0;
  }

  createOrder(assetSendTxn: Txn, mbrTxn: PayTxn, takingAsset: uint64, takingAmount: uint64): uint64 {
    assert(this.txn.sender.isOptedInToAsset(takingAsset), 'Taking asset is not opted in');
    assert(assetSendTxn.sender === this.txn.sender, 'Invalid sender');
    const order = this.buildOrder(assetSendTxn, takingAsset, takingAmount);
    verifyPayTxn(mbrTxn, { amount: { greaterThanEqualTo: BOX_MBR } });
    this.orders(this.orderIndex.value).value = order;
    this.orderIndex.value += 1;
    return order.id;
  }

  private buildOrder(assetSendTxn: Txn, takingAsset: uint64, takingAmount: uint64): Order {
    assert(
      assetSendTxn.typeEnum === TransactionType.AssetTransfer || assetSendTxn.typeEnum === TransactionType.Payment,
      'Invalid transaction type'
    );
    if (assetSendTxn.typeEnum === TransactionType.Payment) {
      assert(assetSendTxn.receiver === this.app.address, 'Invalid receiver');
      return {
        id: this.orderIndex.value,
        owner: this.txn.sender,
        givingAsset: 0,
        takingAsset: takingAsset,
        givingAmount: assetSendTxn.amount,
        takingAmount: takingAmount,
        completed: false,
        ownerClaimed: false,
      };
    }
    assert(assetSendTxn.assetReceiver === this.app.address, 'Invalid receiver');
    return {
      id: this.orderIndex.value,
      owner: this.txn.sender,
      givingAsset: assetSendTxn.xferAsset.id,
      takingAsset: takingAsset,
      givingAmount: assetSendTxn.assetAmount,
      takingAmount: takingAmount,
      completed: false,
      ownerClaimed: false,
    };
  }

  claimOrder(orderId: uint64, assetSendTxn: Txn): void {
    assert(this.orders(orderId).exists, 'Order not found');
    const order = this.orders(orderId).value;
    assert(!order.completed, 'Order already completed');
    assert(
      assetSendTxn.typeEnum === TransactionType.AssetTransfer || assetSendTxn.typeEnum === TransactionType.Payment,
      'Invalid transaction type'
    );
    if (assetSendTxn.typeEnum === TransactionType.Payment) {
      assert(order.takingAsset === 0, 'Invalid giving asset');
      assert(order.takingAmount === assetSendTxn.amount, 'Invalid giving amount');
      assert(this.txn.sender === assetSendTxn.sender, 'Invalid sender');
      assert(this.app.address === assetSendTxn.receiver, 'Invalid receiver');
    } else {
      assert(order.takingAsset === assetSendTxn.xferAsset.id, 'Invalid giving asset');
      assert(order.takingAmount === assetSendTxn.assetAmount, 'Invalid giving amount');
      assert(this.txn.sender === assetSendTxn.assetSender, 'Invalid sender');
      assert(this.app.address === assetSendTxn.assetReceiver, 'Invalid receiver');
    }
    this.orders(orderId).value.completed = true;
    this.send(order.givingAsset, order.givingAmount, this.txn.sender);
    if (order.takingAsset !== 0) {
      const asset = AssetID.fromUint64(order.takingAsset);
      if (order.owner.isOptedInToAsset(asset)) {
        this.orders(orderId).value.ownerClaimed = true;
        this.send(order.takingAsset, order.takingAmount, order.owner);
      }
    } else {
      this.orders(orderId).value.ownerClaimed = true;
      this.send(order.takingAsset, order.takingAmount, order.owner);
    }
  }

  claimOwnerAsset(orderId: uint64): void {
    assert(this.orders(orderId).exists, 'Order not found');
    const order = this.orders(orderId).value;
    assert(order.completed, 'Order not completed');
    assert(!order.ownerClaimed, 'Owner already claimed');
    assert(this.txn.sender === order.owner, 'Invalid sender');
    this.orders(orderId).value = {
      id: order.id,
      owner: order.owner,
      givingAsset: order.givingAsset,
      takingAsset: order.takingAsset,
      givingAmount: order.givingAmount,
      takingAmount: order.takingAmount,
      completed: order.completed,
      ownerClaimed: true,
    };
    this.send(order.takingAsset, order.takingAmount, order.owner);
  }

  optInToAsset(assetId: AssetID, mbrTxn: PayTxn): void {
    assert(!this.app.address.isOptedInToAsset(assetId), 'Already opted in');
    verifyPayTxn(mbrTxn, { amount: { greaterThanEqualTo: globals.assetOptInMinBalance } });
    sendAssetTransfer({ xferAsset: assetId, assetReceiver: this.app.address, assetAmount: 0 });
  }

  cancelOrder(orderId: uint64): void {
    assert(this.orders(orderId).exists, 'Order not found');
    const order = this.orders(orderId).value;
    assert(order.owner === this.txn.sender, 'Invalid sender');
    assert(!order.completed, 'Order already completed');
    this.orders(orderId).delete();
    this.send(order.givingAsset, order.givingAmount, this.txn.sender);
    sendPayment({ receiver: order.owner, amount: BOX_MBR });
  }

  private send(asset: uint64, amount: uint64, receiver: Address): void {
    if (asset === 0) {
      sendPayment({ receiver: receiver, amount: amount });
    } else {
      sendAssetTransfer({
        assetReceiver: receiver,
        assetAmount: amount,
        xferAsset: AssetID.fromUint64(asset),
      });
    }
  }
}
