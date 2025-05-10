export const formatters = {
    formatCEP: (value) => {
      const cep = value.replace(/\D/g, '');
      if (cep.length <= 5) return cep;
      return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    },
  
    formatCPF: (value) => {
      const cpf = value.replace(/\D/g, '');
      if (cpf.length <= 3) return cpf;
      if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
      if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    },
  
    formatPhone: (value) => {
      const phone = value.replace(/\D/g, '');
      if (phone.length <= 2) return phone;
      if (phone.length <= 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
      if (phone.length <= 10) 
        return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
    },
  };