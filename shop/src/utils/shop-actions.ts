import { toast } from "sonner";

export const handleBuy = (
  itemId: string,
  itemName: string,
  price: number,
  category: string,
  currentRound: number,
  balance: number,
  setBalance: (value: number) => void,
  inventory: Record<string, number>,
  setInventory: (value: Record<string, number>) => void,
  purchasedInRound: Record<number, Record<string, number>>,
  setPurchasedInRound: (value: Record<number, Record<string, number>>) => void,
  purchaseHistory: Array<{
    id: number;
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
    date: string;
    category: string;
    round: number;
  }>,
  setPurchaseHistory: (value: typeof purchaseHistory) => void,
  remainingQuantity: number,
  quantity: number,
  massPurchase: boolean = false
): {
  updatedInventory: Record<string, number>;
  updatedBalance: number;
  updatedPurchasedInRound: Record<number, Record<string, number>>;
  updatedPurchaseHistory: typeof purchaseHistory;
} => {
  if (quantity === -1) {
    const userInput = prompt(`Enter the quantity of ${itemName} you want to buy:`, "1");
    quantity = parseInt(userInput || "0", 10);

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Invalid quantity. Please enter a positive number.");
      return {
        updatedInventory: inventory,
        updatedBalance: balance,
        updatedPurchasedInRound: purchasedInRound,
        updatedPurchaseHistory: purchaseHistory,
      };
    }
  }

  const maxAffordableQuantity = Math.floor(balance / price);
  const purchasableQuantity = Math.min(quantity, remainingQuantity, maxAffordableQuantity);

  if (purchasableQuantity > 0) {
    setBalance(parseFloat((balance - price * purchasableQuantity).toFixed(2)));
    const updatedInventory = {
      ...inventory,
      [itemId]: (inventory[itemId] || 0) + purchasableQuantity,
    };
    if (!massPurchase) {
      setInventory(updatedInventory);
      setPurchasedInRound({
        ...purchasedInRound,
        [currentRound]: {
          ...purchasedInRound[currentRound],
          [itemId]: (purchasedInRound[currentRound]?.[itemId] || 0) + purchasableQuantity,
        },
      });
      setPurchaseHistory([
        ...purchaseHistory,
        {
          id: Date.now(),
          itemId,
          itemName,
          price,
          quantity: purchasableQuantity,
          date: new Date().toISOString(),
          category,
          round: currentRound,
        },
      ]);
    }

    toast.success(
      `You bought ${purchasableQuantity} ${itemName}(s) for ${price * purchasableQuantity} PLN.`
    );
    return {
      updatedInventory,
      updatedBalance: balance - price * purchasableQuantity,
      updatedPurchasedInRound: {
      ...purchasedInRound,
      [currentRound]: {
        ...purchasedInRound[currentRound],
        [itemId]: (purchasedInRound[currentRound]?.[itemId] || 0) + purchasableQuantity,
      },
      },
      updatedPurchaseHistory: [
      ...purchaseHistory,
      {
        id: Date.now() - parseInt(itemId, 36) * 1000,
        itemId,
        itemName,
        price,
        quantity: purchasableQuantity,
        date: Date.now().toString(),
        category,
        round: currentRound,
      },
      ],
    };
  } else {
    if (remainingQuantity <= 0) {
      toast.error("The item is out of stock.");
    } else if (maxAffordableQuantity <= 0) {
      toast.error("You don't have enough balance to make this purchase.");
    } else {
      toast.error("Invalid purchase request.");
    }
    return {
      updatedInventory: inventory,
      updatedBalance: balance,
      updatedPurchasedInRound: purchasedInRound,
      updatedPurchaseHistory: purchaseHistory,
    };
  }
};

export const handleOrder = (
  itemId: string,
  itemName: string,
  orderedItems: Record<string, number>,
  setOrderedItems: (value: Record<string, number>) => void
) => {
  const quantity = parseInt(prompt(`How many ${itemName} would you like to order?`, "1") || "0", 10);

  if (isNaN(quantity) || quantity < 0) {
    toast.error("Invalid quantity. Please enter a positive number.");
    return;
  }

  if (quantity === 0) {
    const updatedOrderedItems = { ...orderedItems };
    delete updatedOrderedItems[itemId];
    setOrderedItems(updatedOrderedItems);
  } else {
    setOrderedItems({
      ...orderedItems,
      [itemId]: quantity,
    });
  }

  toast.success(`You ordered ${quantity} ${itemName}(s) for ${quantity} PLN.`);
};