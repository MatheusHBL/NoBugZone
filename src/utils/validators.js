export const validators = {
    validateFullName: (name) => {
      if (!name.trim()) return 'Nome completo é obrigatório';
      if (name.trim().split(' ').length < 2) return 'Digite o nome completo';
      return '';
    },
  
    validateCEP: (cep) => {
      const cepRegex = /^\d{5}-?\d{3}$/;
      if (!cep) return 'CEP é obrigatório';
      if (!cepRegex.test(cep)) return 'CEP inválido (formato: 00000-000)';
      return '';
    },
  
    validateCPF: (cpf) => {
      // Implementação completa da validação de CPF
      const cleanCPF = cpf.replace(/\D/g, '');
      
      if (!cleanCPF) return 'CPF é obrigatório';
      if (cleanCPF.length !== 11) return 'CPF deve conter 11 dígitos';
      
      // Validação completa do CPF...
      return '';
    },
  
    validatePhone: (phone) => {
      const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5}[-.]?\d{4})$/;
      if (!phone) return 'Telefone é obrigatório';
      if (!phoneRegex.test(phone)) return 'Telefone inválido (11 98765-4321)';
      return '';
    },
  
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) return 'E-mail é obrigatório';
      if (!emailRegex.test(email)) return 'E-mail inválido';
      return '';
    },
  
    validatePassword: (password) => {
      if (!password) return 'Senha é obrigatória';
      if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
      
      // Validações específicas...
      return '';
    },
  };