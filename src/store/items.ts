import { create } from "zustand";
import ItemType from "../types/item";
import request from "../server";

interface ItemsStoreType {
  loading: boolean;
  items: ItemType[];
  latestItems: ItemType[];
  collectionItems: ItemType[];
  getAllItems: () => void;
  getItemsByCollection: (collectionId: string | undefined) => void;
  getLatestItems: () => void;
  addItem: (itemData: ItemType, collectionId: string | undefined) => void;
  updateItem: (itemId: string, updatedData: ItemType) => void;
  deleteItem: (itemId: string) => void;
  likeItem: (itemId: string) => void;
  unlikeItem: (itemId: string) => void;
}

const useItems = create<ItemsStoreType>()((set, get) => ({
  loading: false,
  items: [],
  latestItems: [],
  collectionItems: [],
  getAllItems: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("items");
      set({ items: data });
    } finally {
      set({ loading: false });
    }
  },
  getItemsByCollection: async (collectionId) => {
    try {
      set({ loading: true });
      const { data } = await request.get(`items?collectionId=${collectionId}`);
      set({ collectionItems: data });
    } finally {
      set({ loading: false });
    }
  },
  getLatestItems: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("items/latest");
      set({ latestItems: data });
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (itemData, collectionId) => {
    try {
      set({ loading: true });
      await request.post("items", { ...itemData, collectionId });
      await get().getItemsByCollection(collectionId);
    } finally {
      set({ loading: false });
    }
  },
  updateItem: async (itemId, updatedData) => {
    try {
      set({ loading: true });
      await request.patch(`items/${itemId}`, updatedData);
    } finally {
      set({ loading: false });
    }
  },
  deleteItem: async (itemId) => {
    try {
      set({ loading: true });
      await request.delete(`items/${itemId}`);
    } finally {
      set({ loading: false });
    }
  },
  likeItem: async (itemId) => {
    await request.patch(`items/${itemId}/like`);
  },
  unlikeItem: async (itemId) => {
    await request.patch(`items/${itemId}/unlike`);
  },
}));

export default useItems;
