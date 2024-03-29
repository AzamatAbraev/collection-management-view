import { create } from "zustand";
import request from "../server";
import CollectionType from "../types/collection";
import { message } from "antd";

interface ValuesType {
  name: string;
  description: string;
  category: string;
}

interface CollectionStoreType {
  total: number;
  userTotal: number;
  loading: boolean;
  collections: CollectionType[];
  userCollections: CollectionType[];
  setCollections: (collections: CollectionType[]) => void;
  setUserCollections: (collections: CollectionType[]) => void;
  getAllCollections: () => void;
  getUserCollections: () => void;
  addCollection: (values: {
    name: string;
    description: string;
    category: string;
    userId: string;
  }) => void;
  updateCollection: (values: ValuesType, id: string | null) => void;
  deleteCollection: (id: string) => void;
}

const useCollection = create<CollectionStoreType>()((set, get) => ({
  total: 0,
  userTotal: 0,
  loading: false,
  collections: [],
  userCollections: [],
  setCollections: (collections) => set({ collections }),
  setUserCollections: (collections) => set({ collections }),
  getAllCollections: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("collections");
      set({ collections: data, total: data.length });
    } finally {
      set({ loading: false });
    }
  },
  getUserCollections: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("collections/user");
      set({ userCollections: data, userTotal: data.length });
    } finally {
      set({ loading: false });
    }
  },
  addCollection: async (values) => {
    try {
      set({ loading: true });
      await request.post("collections", values);
      await get().getUserCollections();
      message.success("Collection added successfully");
    } finally {
      set({ loading: false });
    }
  },
  updateCollection: async (values, id) => {
    try {
      set({ loading: true });
      await request.patch(`collections/${id}`, values);
      await get().getUserCollections();
      message.success("Collection updated successfully");
    } finally {
      set({ loading: false });
    }
  },
  deleteCollection: async (id) => {
    try {
      set({ loading: true });
      await request.delete(`collections/${id}`);
      await get().getUserCollections();
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCollection;
