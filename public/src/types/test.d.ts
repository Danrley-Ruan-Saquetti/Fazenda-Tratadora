/*
Aplica % sob frete com base no Valor do Frete
Aplica % sob frete com base no Valor dos Produtos
Aplicar valor fixo sob frete
Aplica % sob frete com base no Valor do Frete (com valor de regras calculadas aplicado)
Aplicar valor sob frete com base divisão do peso
*/
type TCalcType = ""
type TCalc = { order: number, value: number }
type ITest = { id: string, notes: string, cep: string, calcs: TCalc[] }

