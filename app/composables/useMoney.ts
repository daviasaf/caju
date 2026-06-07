export function useMoney(){const formatMoney=(v?:number|null)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0));return{formatMoney}}
