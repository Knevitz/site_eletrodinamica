import { create } from "zustand";

const useCarrinhoStore = create((set) => ({
  itens: [],
  adicionar: (produto) =>
    set((state) => {
      const existe = state.itens.find((item) => item.codigo === produto.codigo);
      if (existe) {
        return {
          itens: state.itens.map((item) =>
            item.codigo === produto.codigo
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          ),
        };
      } else {
        return {
          itens: [...state.itens, { ...produto, quantidade: 1 }],
        };
      }
    }),
  remover: (codigo) =>
    set((state) => ({
      itens: state.itens.filter((item) => item.codigo !== codigo),
    })),
  limpar: () => set({ itens: [] }),
  atualizarQuantidade: (codigo, quantidade) =>
    set((state) => ({
      itens: state.itens.map((item) =>
        item.codigo === codigo ? { ...item, quantidade } : item
      ),
    })),
}));

export default useCarrinhoStore;
