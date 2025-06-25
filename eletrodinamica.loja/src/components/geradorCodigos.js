// geradorCodigos.js
export function gerarCombinacoes(opcoesSelect) {
  const chaves = Object.keys(opcoesSelect);
  if (chaves.length === 0) return [];

  const combinar = (index = 0) => {
    if (index === chaves.length) return [{}];
    const combinacoesRestantes = combinar(index + 1);
    const chaveAtual = chaves[index];
    const valores = opcoesSelect[chaveAtual] || [];

    return valores.flatMap((valor) =>
      combinacoesRestantes.map((combinacao) => ({
        [chaveAtual]: valor,
        ...combinacao,
      }))
    );
  };

  return combinar();
}
