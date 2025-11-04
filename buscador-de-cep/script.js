// 1. Espera o DOM carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // 2. Pega as referências de TODOS os elementos do HTML
    
    // --- Etapa 1: Busca CEP ---
    const cepInput = document.getElementById('cep-input');
    const searchBtn = document.getElementById('search-btn');
    
    // --- Indicador de Loading ---
    const loadingIndicator = document.getElementById('loading-indicator');

    // --- Etapa 2: Resultados do Endereço ---
    const resultContainer = document.getElementById('result-container');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const numeroInput = document.getElementById('numero');
    const btnProximo = document.getElementById('btn-proximo');
    
    // --- Etapa 3: Dados Pessoais ---
    const userInfoContainer = document.getElementById('user-info-container');
    const nomeInput = document.getElementById('nome-completo');
    const generoInput = document.getElementById('genero');
    const dataNascimentoInput = document.getElementById('data-nascimento');
    const btnEnviar = document.getElementById('btn-enviar');

    // --- Etapa 4: Sucesso ---
    const successMessage = document.getElementById('success-message');

    // --- Etapa 5: Captura o novo indicador de loading ---
    const submitLoading = document.getElementById('submit-loading-indicator');


    // 3. Adiciona um "ouvinte de evento" de clique no botão de busca
    searchBtn.addEventListener('click', buscarCep);

    // 4. Adiciona "ouvinte" para a tecla Enter no CEP (CORRIGIDO)
    cepInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita comportamento padrão (como enviar formulário)
            searchBtn.click(); // Aciona o clique do botão
        }
    });

    // 5. Define a função principal de busca
    async function buscarCep() {
        
        const cepBruto = cepInput.value;

        // 1. Verifica se o campo está vazio
        if (cepBruto.trim() === '') {
            alert('O campo CEP está vazio. Por favor, preencha.');
            return;
        }
        
        const cepLimpo = cepBruto.replace(/\D/g, ''); 

        // 2. Verifica se o CEP (já limpo) tem o tamanho correto
        if (cepLimpo.length !== 8) {
            alert('CEP inválido. Digite 8 números.');
            return;
        }
        
        // --- LÓGICA DE LOADING ---
        limparFormulario(); // Limpa dados antigos e esconde containers
        
        resultContainer.classList.remove('is-visible'); 
        loadingIndicator.classList.remove('hidden');    // Mostra "Carregando..."

        // 3. Bloco try...catch...finally 
        try {
            const apiUrl = `https://viacep.com.br/ws/${cepLimpo}/json/`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // 4. Verifica se a API retornou um erro
            if (data.erro) {
                alert('CEP não encontrado.'); 
            } else {
                // Preenche os campos com os dados
                logradouroInput.value = data.logradouro;
                bairroInput.value = data.bairro;
                localidadeInput.value = data.localidade;
                ufInput.value = data.uf;
                
                // Mostra o container de resultados
                resultContainer.classList.add('is-visible'); 
                numeroInput.focus(); // Foca no campo 'Número'
            }

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Não foi possível buscar o CEP. Verifique sua conexão.');
        } finally {
            loadingIndicator.classList.add('hidden'); // Esconde "Carregando..."
        }
    }

    // 6. Função auxiliar para limpar TUDO
    function limparFormulario() {
        // Limpa campos de endereço
        logradouroInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
        numeroInput.value = ''; 
        
        // Limpa campos de dados pessoais
        nomeInput.value = '';
        generoInput.value = '';
        dataNascimentoInput.value = '';
        
        // Reseta botões
        btnProximo.disabled = true;
        btnEnviar.disabled = true;

        // Esconde containers (exceto o de busca)
        userInfoContainer.classList.remove('is-visible');
        successMessage.classList.remove('is-visible');
        
        // Garante que o novo loading também seja escondido
        submitLoading.classList.add('hidden');
    }

    // --- LÓGICA DOS NOVOS BOTÕES E ETAPAS ---

    // 7. Habilita o botão "Próximo" quando o campo "Número" é preenchido
    numeroInput.addEventListener('input', () => {
        if (numeroInput.value.trim() !== '') {
            btnProximo.disabled = false;
        } else {
            btnProximo.disabled = true;
        }
    });

    // 8. Ao clicar em "Próximo", mostra o formulário de dados pessoais
    btnProximo.addEventListener('click', () => {
        userInfoContainer.classList.add('is-visible');
        // Rola a tela suavemente para os novos campos
        userInfoContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        nomeInput.focus();
    });

    // 9. Função para verificar o preenchimento dos dados pessoais
    function checkUserInfoForm() {
        const nomeValido = nomeInput.value.trim() !== '';
        const generoValido = generoInput.value.trim() !== '';
        const dataValida = dataNascimentoInput.value.trim() !== '';

        // O botão só é habilitado se TODOS os campos forem válidos
        btnEnviar.disabled = !(nomeValido && generoValido && dataValida);
    }

    // 10. Adiciona listeners aos campos de dados pessoais
    nomeInput.addEventListener('input', checkUserInfoForm);
    generoInput.addEventListener('change', checkUserInfoForm);
    dataNascimentoInput.addEventListener('change', checkUserInfoForm);

    // 11. Ao clicar em "Enviar dados", CHAMA A FUNÇÃO de envio
    btnEnviar.addEventListener('click', () => {
        // Primeiro, desabilita o botão para evitar cliques duplos
        btnEnviar.disabled = true;
        
        // Coleta todos os dados em um objeto
        var dadosFormulario = {
            nome: nomeInput.value,
            genero: generoInput.value,
            nascimento: dataNascimentoInput.value,
            cep: cepInput.value,
            rua: logradouroInput.value,
            numero: numeroInput.value,
            bairro: bairroInput.value,
            cidade: localidadeInput.value,
            estado: ufInput.value
        };

        // Chama a função assíncrona para enviar os dados
        enviarDadosParaPlanilha(dadosFormulario);
    });

    // 12. NOVA FUNÇÃO: Envia os dados para o Google Apps Script
    async function enviarDadosParaPlanilha(dados) {
        
        // --- URL DA SUA IMPLANTAÇÃO ---
        const urlDoAppsScript = "https://script.google.com/macros/s/AKfycbyn71yXwl20DOwwyunpwKhLwR9hIBOijCEZXVrdMJYe17mxvLIHc_PbVAOBj9vKLB05sA/exec";
        
        // Mostra o loading de envio
        submitLoading.classList.remove('hidden');

        try {
            const response = await fetch(urlDoAppsScript, {
                method: 'POST',
                mode: 'no-cors', // Importante para Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            // Como usamos 'no-cors', não podemos ler a resposta
            // Vamos apenas assumir que deu certo e mostrar a mensagem de sucesso
            
            console.log('Dados enviados (modo no-cors)');

            // Esconde os containers de formulário
            resultContainer.classList.remove('is-visible');
            userInfoContainer.classList.remove('is-visible');
            
            // Mostra a mensagem de sucesso
            successMessage.classList.add('is-visible');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Houve um erro ao enviar seus dados. Tente novamente.');
            
            // Reabilita o botão se der erro
            btnEnviar.disabled = false;
        } finally {
            // MUDANÇA AQUI: Esconde o loading, independente de sucesso ou erro
            submitLoading.classList.add('hidden');
        }
    }
    
});

