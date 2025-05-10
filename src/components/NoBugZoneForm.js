import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PersonalDataForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    cep: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Função para formatar o nome (remover caracteres inválidos)
  const formatName = (name) => {
    // Permite apenas letras (incluindo acentuadas), espaços, hífen, ponto e apóstrofo
    return name.replace(/[^a-zA-ZÀ-ÿ\s\-\.']/g, '');
  };

  // Validações
  const validateFullName = (name) => {
    if (!name.trim()) return 'Nome completo é obrigatório';
    if (name.trim().split(' ').length < 2) return 'Digite o nome completo';
    
    // Verifica se contém apenas caracteres permitidos
    const validNameRegex = /^[a-zA-ZÀ-ÿ\s\-\.']+$/;
    if (!validNameRegex.test(name)) {
      return 'Nome pode conter apenas letras, espaços, hífen, ponto e apóstrofo';
    }
    
    return '';
  };

  const validateCEP = (cep) => {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (!cleanCEP) return 'CEP é obrigatório';
    if (cleanCEP.length !== 8) return 'CEP deve conter 8 dígitos';
    
    // Verifica se não é um CEP com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cleanCEP)) return 'CEP inválido';
    
    // Formato válido: 00000-000
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) return 'CEP inválido (formato: 00000-000)';
    
    return '';
  };

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (!cleanCPF) return 'CPF é obrigatório';
    if (cleanCPF.length !== 11) return 'CPF deve conter 11 dígitos';
    
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cleanCPF)) return 'CPF inválido';
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleanCPF.charAt(9)) !== digit) return 'CPF inválido';
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleanCPF.charAt(10)) !== digit) return 'CPF inválido';
    
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5}[-.]?\d{4})$/;
    if (!phone) return 'Telefone é obrigatório';
    if (!phoneRegex.test(phone)) return 'Telefone inválido (11 98765-4321)';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'E-mail é obrigatório';
    if (!emailRegex.test(email)) return 'E-mail inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
    
    // Verificações específicas
    if (!/[a-z]/.test(password)) return 'Senha deve conter letra minúscula';
    if (!/[A-Z]/.test(password)) return 'Senha deve conter letra maiúscula';
    if (!/[0-9]/.test(password)) return 'Senha deve conter número';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) 
      return 'Senha deve conter caractere especial';
    if (/[áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(password)) 
      return 'Senha não pode conter acentos ou ç';
    
    return '';
  };

  // Formatadores
  const formatCEP = (value) => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 2) return phone;
    if (phone.length <= 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    if (phone.length <= 10) 
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
  };

  // Handlers
  const handleChange = (field, value) => {
    let formattedValue = value;
    
    switch (field) {
      case 'fullName':
        formattedValue = formatName(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'phone':
        formattedValue = formatPhone(value);
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
    
    // Limpar erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      fullName: '',
      cep: '',
      cpf: '',
      phone: '',
      email: '',
      password: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowSuccessModal(false);
  };

  const handleSubmit = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      cep: validateCEP(formData.cep),
      cpf: validateCPF(formData.cpf),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    
    setErrors(newErrors);
    
    // Verificar se há erros
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      // Mostrar modal de sucesso ao invés de Alert
      setShowSuccessModal(true);
      console.log('Dados do formulário:', formData);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Dados Pessoais</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            value={formData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#999"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={[styles.input, errors.cep && styles.inputError]}
            value={formData.cep}
            onChangeText={(value) => handleChange('cep', value)}
            placeholder="00000-000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={9}
          />
          {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={[styles.input, errors.cpf && styles.inputError]}
            value={formData.cpf}
            onChangeText={(value) => handleChange('cpf', value)}
            placeholder="000.000.000-00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={14}
          />
          {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone Celular</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={15}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, errors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Text style={styles.passwordHint}>
            Mínimo 8 caracteres, incluindo: minúscula, maiúscula, número e caractere especial (sem acentos)
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Sucesso */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="check-circle" size={60} color="#34C759" />
            <Text style={styles.modalTitle}>Validado com Sucesso!</Text>
            <Text style={styles.modalMessage}>
              Seus dados foram validados e enviados com sucesso.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={resetForm}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputError: {
    borderColor: '#ff3333',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 14,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#fff',
    flex: 1,
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  passwordHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});