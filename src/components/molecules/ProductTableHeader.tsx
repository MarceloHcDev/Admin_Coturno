import React from 'react';

export const ProductTableHeader: React.FC = () => {
  const headers: string[] = [
    'PRODUTO', 
    'TIPO', 
    'MARCA / MODELO', 
    'PREÇO', 
    'ESTOQUE', 
    'TAMANHOS', 
    'COR', 
    'STATUS', 
    'AÇÕES'
  ];
  
  return (
    <thead className="bg-slate-50 border-b border-slate-100">
      <tr>
        {headers.map((header, index) => (
          <th 
            key={header} 
            className={`py-3 px-6 text-xs font-semibold text-gray-400 tracking-wider text-left ${
              index === headers.length - 1 ? 'text-center' : ''
            }`}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ProductTableHeader;