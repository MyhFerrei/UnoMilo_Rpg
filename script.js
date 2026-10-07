const SENHA_CORRETA = "MiloHazard";

const LISTA_MESA_COMPLETA = [
    "BloqueioBlue.png", "BloqueioGreen.png", "BloqueioRed.png", "BloqueioYellow.png",
    "CincoBlue.png", "CincoGreen.png", "CincoRed.png", "CincoYellow.png",
    "Coringa.png", "CoringaMaisQuatro.png", "DoisBlue.png", "DoisGreen.png",
    "DoisRed.png", "DoisYellow.png", "MaisDoisBlue.png", "MaisDoisGreen.png",
    "MaisDoisRed.png", "MaisDoisYellow.png", "MaisQuatroBlue.png", "MaisQuatroGreen.png",
    "MaisQuatroRed.png", "MaisQuatroYellow.png", "NoveBlue.png", "NoveGreen.png",
    "NoveRed.png", "NoveYellow.png", "OitoBlue.png", "OitoGreen.png",
    "OitoRed.png", "OitoYellow.png", "QuatroBlue.png", "QuatroGreen.png",
    "QuatroRed.png", "QuatroYellow.png", "SeisBlue.png", "SeisGreen.png",
    "SeisRed.png", "SeisYellow.png", "SeteBlue.png", "SeteGreen.png",
    "SeteRed.png", "SeteYellow.png", "Sun.png", "TresBlue.png",
    "TresGreen.png", "TresRed.png", "TresYellow.png", "UmBlue.png",
    "UmGreen.png", "UmRed.png", "UmYellow.png", "VolteBlue.png",
    "VolteGreen.png", "VolteRed.png", "VolteYellow.png", "ZeroBlue.png",
    "ZeroGreen.png", "ZeroRed.png", "ZeroYellow.png"
];

const LISTA_BARALHO_EXIBICAO = [
    "Sun.png", "Coringa.png", "CoringaMaisQuatro.png",
    "ZeroRed.png", "UmRed.png", "DoisRed.png", "TresRed.png", "QuatroRed.png",
    "CincoRed.png", "SeisRed.png", "SeteRed.png", "OitoRed.png", "NoveRed.png",
    "MaisDoisRed.png", "MaisQuatroRed.png", "BloqueioRed.png", "VolteRed.png"
];

let descricoesCartas = JSON.parse(localStorage.getItem('jojo_uno_descricoes')) || {};

function getTipoBaseCarta(nomeCarta) {
    return nomeCarta
        .replace('Red.png', '')
        .replace('Blue.png', '')
        .replace('Green.png', '')
        .replace('Yellow.png', '')
        .replace('.png', '')
        .trim();
}

function getDescricaoCarta(nomeCarta) {
    const tipo = getTipoBaseCarta(nomeCarta);
    return descricoesCartas[tipo] || "Sem descrição definida para esta carta de Stand.";
}

let baralhoAtual = [...LISTA_MESA_COMPLETA];
let cartasNaMesa = [null, null, null, null, null];
let estadoRevelado = [false, false, false, false, false];

const telaLogin = document.getElementById('tela-login');
const telaInicial = document.getElementById('tela-inicial');
const telaMesa = document.getElementById('tela-mesa');
const telaBaralho = document.getElementById('tela-baralho');

// SISTEMA DE SENHA
const formLogin = document.getElementById('form-login');
const inputSenha = document.getElementById('input-senha');
const msgErroSenha = document.getElementById('msg-erro-senha');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputSenha.value === SENHA_CORRETA) {
        msgErroSenha.innerText = "";
        abrirTela(telaInicial);
    } else {
        msgErroSenha.innerText = "Senha incorreta! Tente novamente.";
        inputSenha.value = "";
        inputSenha.focus();
    }
});

const btnIrMesa = document.getElementById('btn-ir-mesa');
const btnIrBaralho = document.getElementById('btn-ir-baralho');
const btnsVoltar = document.querySelectorAll('.btn-voltar');

const slotsMesa = document.querySelectorAll('.slot');
const deckPuxar = document.getElementById('deck-puxar');
const btnResetMesa = document.getElementById('btn-reset-mesa');
const textoDescricaoDOM = document.getElementById('texto-descricao');
const cartaAnimadaDOM = document.getElementById('carta-animada');

const modal = document.getElementById('modal-edicao');
const modalImg = document.getElementById('modal-img-carta');
const modalInput = document.getElementById('modal-input-desc');
const btnSalvarDesc = document.getElementById('btn-salvar-desc');
const closeModal = document.querySelector('.close-modal');
let cartaTipoSendoEditada = null;

function getCaminhoDeck(nomeCarta) {
    return `assets/deck/${encodeURIComponent(nomeCarta)}`;
}

btnIrMesa.addEventListener('click', () => abrirTela(telaMesa));
btnIrBaralho.addEventListener('click', () => {
    renderizarColecao();
    abrirTela(telaBaralho);
});

btnsVoltar.forEach(btn => {
    btn.addEventListener('click', () => abrirTela(telaInicial));
});

function abrirTela(telaAlvo) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('active'));
    telaAlvo.classList.add('active');
}

// Puxar carta do Deck para a Mesa
deckPuxar.addEventListener('click', () => {
    const slotLivre = cartasNaMesa.findIndex(c => c === null);
    if (slotLivre === -1) {
        alert("A mesa já tem 5 cartas!");
        return;
    }
    if (baralhoAtual.length === 0) {
        alert("O baralho terminou! Clique nas setas para recarregar.");
        return;
    }

    const indexSorteado = Math.floor(Math.random() * baralhoAtual.length);
    const cartaSorteada = baralhoAtual.splice(indexSorteado, 1)[0];

    const deckRect = deckPuxar.getBoundingClientRect();
    const slotRect = slotsMesa[slotLivre].getBoundingClientRect();

    cartaAnimadaDOM.style.left = `${deckRect.left}px`;
    cartaAnimadaDOM.style.top = `${deckRect.top}px`;
    cartaAnimadaDOM.style.display = 'block';

    setTimeout(() => {
        cartaAnimadaDOM.style.left = `${slotRect.left}px`;
        cartaAnimadaDOM.style.top = `${slotRect.top}px`;
    }, 20);

    setTimeout(() => {
        cartaAnimadaDOM.style.display = 'none';
        cartasNaMesa[slotLivre] = cartaSorteada;
        estadoRevelado[slotLivre] = false;
        atualizarMesaDOM();
    }, 420);
});

// Revelar carta ao clicar nela
slotsMesa.forEach((slot, index) => {
    slot.addEventListener('click', () => {
        const carta = cartasNaMesa[index];
        if (carta) {
            estadoRevelado[index] = true;
            textoDescricaoDOM.innerText = getDescricaoCarta(carta);
            atualizarMesaDOM();
        }
    });
});

// Reset da Mesa
btnResetMesa.addEventListener('click', () => {
    baralhoAtual = [...LISTA_MESA_COMPLETA];
    cartasNaMesa = [null, null, null, null, null];
    estadoRevelado = [false, false, false, false, false];
    textoDescricaoDOM.innerText = "Puxe uma carta do deck e clique sobre ela na mesa para revelar e ver os detalhes.";
    atualizarMesaDOM();
});

function atualizarMesaDOM() {
    slotsMesa.forEach((slot, index) => {
        const carta = cartasNaMesa[index];
        const revelada = estadoRevelado[index];

        slot.innerHTML = "";

        if (carta) {
            slot.classList.add('com-carta');
            const img = document.createElement('img');
            img.className = 'slot-carta';
            img.src = revelada ? getCaminhoDeck(carta) : 'assets/deck/Verso.png';
            slot.appendChild(img);
        } else {
            slot.classList.remove('com-carta');
        }
    });
}

// Coleção e Modal
function renderizarColecao() {
    const grid = document.getElementById('grid-colecao');
    grid.innerHTML = "";

    LISTA_BARALHO_EXIBICAO.forEach(carta => {
        const img = document.createElement('img');
        img.className = 'card-colecao';
        img.src = getCaminhoDeck(carta);
        img.addEventListener('click', () => abrirModalEdicao(carta));
        grid.appendChild(img);
    });
}

function abrirModalEdicao(carta) {
    cartaTipoSendoEditada = getTipoBaseCarta(carta);
    modalImg.src = getCaminhoDeck(carta);
    modalInput.value = descricoesCartas[cartaTipoSendoEditada] || "";
    modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => modal.style.display = 'none');

btnSalvarDesc.addEventListener('click', () => {
    if (cartaTipoSendoEditada) {
        descricoesCartas[cartaTipoSendoEditada] = modalInput.value;
        localStorage.setItem('jojo_uno_descricoes', JSON.stringify(descricoesCartas));
        modal.style.display = 'none';
    }
});