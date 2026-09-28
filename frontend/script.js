/**
 * SportGear — Lógica da Aplicação Frontend (Vanilla JavaScript)
 * Consome a API REST com fetch(), manipula o DOM e gerencia o estado da interface.
 */

// Detecta a URL base da API
const API_BASE_URL = (
  window.location.protocol.startsWith('http')
    ? `${window.location.origin}/api/acessorios`
    : 'http://localhost:3000/api/acessorios'
);

// Estado local da aplicação
let todosAcessorios = [];
let acessorioParaExcluir = null;
let buscaDebounceTimer = null;

// Elementos da Interface (DOM)
const gridAcessorios = document.getElementById('grid-acessorios');
const loadingState = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const errorMsg = document.getElementById('error-msg');
const contadorTotal = document.getElementById('contador-total');

// Controles de busca e filtro
const inputBusca = document.getElementById('input-busca');
const btnLimparBusca = document.getElementById('btn-limpar-busca');
const selectEsporte = document.getElementById('select-esporte');
const btnRecarregar = document.getElementById('btn-recarregar');
const btnTentarNovamente = document.getElementById('btn-tentar-novamente');
const btnNovo = document.getElementById('btn-novo');
const btnCadastrarPrimeiro = document.getElementById('btn-cadastrar-primeiro');

// Modal de Formulário (Cadastro / Edição)
const modalForm = document.getElementById('modal-form');
const formAcessorio = document.getElementById('form-acessorio');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSalvar = document.getElementById('btn-salvar');

// Campos do Formulário
const formId = document.getElementById('form-id');
const formEsporte = document.getElementById('form-esporte');
const formMarca = document.getElementById('form-marca');
const formModelo = document.getElementById('form-modelo');
const formPreco = document.getElementById('form-preco');
const formFoto = document.getElementById('form-foto');
const formImgPreview = document.getElementById('form-img-preview');
const previewPlaceholder = document.getElementById('preview-placeholder');

// Modal de Exclusão
const modalDelete = document.getElementById('modal-delete');
const deleteItemNome = document.getElementById('delete-item-nome');
const btnCancelarDelete = document.getElementById('btn-cancelar-delete');
const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');

// Container de Notificações Toast
const toastContainer = document.getElementById('toast-container');

// SVG Fallback para imagens quebradas ou ausentes
const SVG_FALLBACK = `
  <div class="fallback-banner">
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
    <span>Item Esportivo</span>
  </div>
`;

// ==========================================================================
// Inicialização e Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  carregarAcessorios();

  // Abertura do modal de criação
  btnNovo.addEventListener('click', abrirModalCadastro);
  btnCadastrarPrimeiro.addEventListener('click', abrirModalCadastro);

  // Fechamento de modais
  modalClose.addEventListener('click', fecharModalForm);
  btnCancelar.addEventListener('click', fecharModalForm);
  btnCancelarDelete.addEventListener('click', fecharModalDelete);

  // Submissão do formulário
  formAcessorio.addEventListener('submit', salvarAcessorio);

  // Confirmação de exclusão
  btnConfirmarDelete.addEventListener('click', executarExclusao);

  // Filtros e busca em tempo real
  selectEsporte.addEventListener('change', () => carregarAcessorios());
  btnRecarregar.addEventListener('click', () => carregarAcessorios());
  btnTentarNovamente.addEventListener('click', () => carregarAcessorios());

  inputBusca.addEventListener('input', () => {
    btnLimparBusca.classList.toggle('hidden', !inputBusca.value);
    clearTimeout(buscaDebounceTimer);
    buscaDebounceTimer = setTimeout(() => {
      carregarAcessorios();
    }, 350);
  });

  btnLimparBusca.addEventListener('click', () => {
    inputBusca.value = '';
    btnLimparBusca.classList.add('hidden');
    carregarAcessorios();
  });

  // Atualização em tempo real do preview da foto
  formFoto.addEventListener('input', atualizarPreviewFoto);

  // Fechar modais ao teclar 'Escape' ou clicar fora da caixa
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fecharModalForm();
      fecharModalDelete();
    }
  });

  modalForm.addEventListener('click', (e) => {
    if (e.target === modalForm) fecharModalForm();
  });

  modalDelete.addEventListener('click', (e) => {
    if (e.target === modalDelete) fecharModalDelete();
  });
});

// ==========================================================================
// Funções de Consumo da API (GET, POST, PUT, DELETE)
// ==========================================================================

/**
 * Busca os acessórios na API aplicando os filtros atuais
 */
async function carregarAcessorios() {
  exibirEstado('loading');

  try {
    const params = new URLSearchParams();
    const esporte = selectEsporte.value.trim();
    const busca = inputBusca.value.trim();

    if (esporte) params.append('esporte', esporte);
    if (busca) params.append('busca', busca);

    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao consultar a API.`);
    }

    todosAcessorios = await response.json();
    contadorTotal.textContent = todosAcessorios.length;

    if (!Array.isArray(todosAcessorios) || todosAcessorios.length === 0) {
      exibirEstado('empty');
    } else {
      renderizarCards(todosAcessorios);
      exibirEstado('grid');
    }
  } catch (error) {
    console.error('[ERRO] Falha ao carregar acessórios:', error);
    errorMsg.textContent = error.message || 'Não foi possível conectar ao servidor da API.';
    exibirEstado('error');
    mostrarToast('Erro ao consultar os acessórios.', 'error');
  }
}

/**
 * Salva um acessório (criação via POST ou edição via PUT)
 */
async function salvarAcessorio(event) {
  event.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const id = formId.value.trim();
  const dados = {
    esporte: formEsporte.value.trim(),
    marca: formMarca.value.trim(),
    modelo: formModelo.value.trim(),
    preco: parseFloat(formPreco.value),
    foto: formFoto.value.trim(),
  };

  const isEdicao = Boolean(id);
  const url = isEdicao ? `${API_BASE_URL}/${id}` : API_BASE_URL;
  const metodo = isEdicao ? 'PUT' : 'POST';

  setBotaoSalvarCarregando(true);

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const resultado = await response.json();

    if (!response.ok) {
      const mensagemErro = resultado.detalhes
        ? resultado.detalhes.join(' ')
        : (resultado.erro || 'Falha ao processar operação.');
      throw new Error(mensagemErro);
    }

    mostrarToast(
      isEdicao ? 'Acessório atualizado com sucesso!' : 'Acessório cadastrado com sucesso!',
      'success'
    );

    fecharModalForm();
    carregarAcessorios();
  } catch (error) {
    console.error('[ERRO AO SALVAR]:', error);
    mostrarToast(error.message, 'error');
  } finally {
    setBotaoSalvarCarregando(false);
  }
}

/**
 * Executa a exclusão de um acessório (DELETE)
 */
async function executarExclusao() {
  if (!acessorioParaExcluir) return;

  btnConfirmarDelete.disabled = true;
  btnConfirmarDelete.textContent = 'Excluindo...';

  try {
    const response = await fetch(`${API_BASE_URL}/${acessorioParaExcluir}`, {
      method: 'DELETE',
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.erro || 'Falha ao excluir o acessório.');
    }

    mostrarToast('Acessório excluído com sucesso!', 'success');
    fecharModalDelete();
    carregarAcessorios();
  } catch (error) {
    console.error('[ERRO AO EXCLUIR]:', error);
    mostrarToast(error.message, 'error');
  } finally {
    btnConfirmarDelete.disabled = false;
    btnConfirmarDelete.textContent = 'Excluir Definitivamente';
  }
}

// ==========================================================================
// Renderização dos Componentes no DOM
// ==========================================================================

/**
 * Renderiza os cards na grade de acessórios
 */
function renderizarCards(lista) {
  gridAcessorios.innerHTML = '';

  lista.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card-item';
    card.setAttribute('data-id', item._id);

    const precoFormatado = formatarMoeda(item.preco);
    const esporteEscapado = escaparHTML(item.esporte);
    const marcaEscapada = escaparHTML(item.marca);
    const modeloEscapado = escaparHTML(item.modelo);

    card.innerHTML = `
      <div class="card-media" id="media-${item._id}">
        <span class="card-badge">${esporteEscapado}</span>
        ${
          item.foto
            ? `<img 
                src="${escaparHTML(item.foto)}" 
                alt="${modeloEscapado}" 
                class="card-img"
                loading="lazy"
                onerror="window.tratarImagemQuebrada('${item._id}')"
               >`
            : SVG_FALLBACK
        }
      </div>
      <div class="card-body">
        <div class="card-brand">${marcaEscapada}</div>
        <h3 class="card-title" title="${modeloEscapado}">${modeloEscapado}</h3>
        <div class="card-price-row">
          <span class="card-price-label">Preço à vista</span>
          <span class="card-price-val">${precoFormatado}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-card-edit" onclick="window.abrirModalEdicao('${item._id}')">
            ✏️ Editar
          </button>
          <button class="btn btn-card-delete" onclick="window.solicitarExclusao('${item._id}')">
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;

    gridAcessorios.appendChild(card);
  });
}

/**
 * Trata o erro de imagem quebrada inserindo o fallback SVG seguro
 */
window.tratarImagemQuebrada = function (id) {
  const container = document.getElementById(`media-${id}`);
  if (container) {
    const badge = container.querySelector('.card-badge');
    const badgeHtml = badge ? badge.outerHTML : '';
    container.innerHTML = `${badgeHtml}${SVG_FALLBACK}`;
  }
};

// ==========================================================================
// Manipulação de Modais e Formulários
// ==========================================================================

function abrirModalCadastro() {
  limparErrosFormulario();
  formAcessorio.reset();
  formId.value = '';
  modalTitle.textContent = 'Novo Acessório';
  atualizarPreviewFoto();
  modalForm.classList.remove('hidden');
  formEsporte.focus();
}

window.abrirModalEdicao = function (id) {
  const item = todosAcessorios.find((a) => a._id === id);
  if (!item) return;

  limparErrosFormulario();
  formId.value = item._id;
  formEsporte.value = item.esporte || '';
  formMarca.value = item.marca || '';
  formModelo.value = item.modelo || '';
  formPreco.value = item.preco !== undefined ? item.preco : '';
  formFoto.value = item.foto || '';

  modalTitle.textContent = 'Editar Acessório';
  atualizarPreviewFoto();
  modalForm.classList.remove('hidden');
  formEsporte.focus();
};

function fecharModalForm() {
  modalForm.classList.add('hidden');
  formAcessorio.reset();
  limparErrosFormulario();
}

window.solicitarExclusao = function (id) {
  const item = todosAcessorios.find((a) => a._id === id);
  if (!item) return;

  acessorioParaExcluir = id;
  deleteItemNome.textContent = `"${item.marca} - ${item.modelo}"`;
  modalDelete.classList.remove('hidden');
};

function fecharModalDelete() {
  modalDelete.classList.add('hidden');
  acessorioParaExcluir = null;
}

/**
 * Atualiza o preview da imagem no modal conforme digitação da URL
 */
function atualizarPreviewFoto() {
  const url = formFoto.value.trim();

  if (url) {
    formImgPreview.src = url;
    formImgPreview.style.display = 'block';
    previewPlaceholder.style.display = 'none';

    formImgPreview.onerror = () => {
      formImgPreview.style.display = 'none';
      previewPlaceholder.style.display = 'flex';
      previewPlaceholder.innerHTML = `
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ef4444" stroke-width="1.8">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span style="color:#ef4444">URL da foto inválida ou inacessível</span>
      `;
    };

    formImgPreview.onload = () => {
      formImgPreview.style.display = 'block';
      previewPlaceholder.style.display = 'none';
    };
  } else {
    formImgPreview.style.display = 'none';
    formImgPreview.src = '';
    previewPlaceholder.style.display = 'flex';
    previewPlaceholder.innerHTML = `
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>Nenhuma foto para prévia</span>
    `;
  }
}

// ==========================================================================
// Validação de Formulário
// ==========================================================================
function validarFormulario() {
  limparErrosFormulario();
  let valido = true;

  const esporte = formEsporte.value.trim();
  const marca = formMarca.value.trim();
  const modelo = formModelo.value.trim();
  const precoStr = formPreco.value.trim();
  const preco = parseFloat(precoStr);

  if (!esporte) {
    mostrarErroCampo('form-esporte', 'erro-esporte', 'O esporte é obrigatório.');
    valido = false;
  } else if (esporte.length < 2) {
    mostrarErroCampo('form-esporte', 'erro-esporte', 'Mínimo de 2 caracteres.');
    valido = false;
  }

  if (!marca) {
    mostrarErroCampo('form-marca', 'erro-marca', 'A marca é obrigatória.');
    valido = false;
  } else if (marca.length < 2) {
    mostrarErroCampo('form-marca', 'erro-marca', 'Mínimo de 2 caracteres.');
    valido = false;
  }

  if (!modelo) {
    mostrarErroCampo('form-modelo', 'erro-modelo', 'O modelo é obrigatório.');
    valido = false;
  } else if (modelo.length < 2) {
    mostrarErroCampo('form-modelo', 'erro-modelo', 'Mínimo de 2 caracteres.');
    valido = false;
  }

  if (precoStr === '') {
    mostrarErroCampo('form-preco', 'erro-preco', 'O preço é obrigatório.');
    valido = false;
  } else if (isNaN(preco) || preco < 0) {
    mostrarErroCampo('form-preco', 'erro-preco', 'Informe um valor numérico válido maior ou igual a 0.');
    valido = false;
  }

  return valido;
}

function mostrarErroCampo(inputId, errorSpanId, mensagem) {
  const input = document.getElementById(inputId);
  const span = document.getElementById(errorSpanId);
  if (input) input.classList.add('has-error');
  if (span) span.textContent = mensagem;
}

function limparErrosFormulario() {
  document.querySelectorAll('.form-group input').forEach((inp) => inp.classList.remove('has-error'));
  document.querySelectorAll('.field-error').forEach((sp) => (sp.textContent = ''));
}

function setBotaoSalvarCarregando(carregando) {
  const btnText = btnSalvar.querySelector('.btn-text');
  const btnSpinner = btnSalvar.querySelector('.btn-spinner');

  if (carregando) {
    btnSalvar.disabled = true;
    btnText.textContent = 'Processando...';
    btnSpinner.classList.remove('hidden');
  } else {
    btnSalvar.disabled = false;
    btnText.textContent = 'Salvar Acessório';
    btnSpinner.classList.add('hidden');
  }
}

// ==========================================================================
// Utilitários de Interface e Mensagens (Toasts)
// ==========================================================================

function exibirEstado(estado) {
  loadingState.classList.toggle('hidden', estado !== 'loading');
  emptyState.classList.toggle('hidden', estado !== 'empty');
  errorState.classList.toggle('hidden', estado !== 'error');
  gridAcessorios.classList.toggle('hidden', estado !== 'grid');
}

function mostrarToast(mensagem, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;

  const icone = tipo === 'success' ? '✓' : '⚠️';

  toast.innerHTML = `
    <span class="toast-icon">${icone}</span>
    <span class="toast-msg">${escaparHTML(mensagem)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function formatarMoeda(valor) {
  const num = Number(valor);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escaparHTML(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
