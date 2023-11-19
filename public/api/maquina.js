function abrirModalEditarMaquina(id, nome, modelo, marca, numero_serie) {

    document.getElementById("nome").value = nome;
    document.getElementById("modelo").value = modelo;
    document.getElementById("numeroSerie").value = numero_serie;
    document.getElementById("marca").value = marca;

    

    var tituloModal = document.getElementById("tituloModal");
    var buttonsModal = document.getElementById("buttonsModal");

    document.getElementById("containerSalas").style.display = "none";
    document.getElementById("modal").style.display = "flex"

    tituloModal.innerHTML = `Edite as informações da Máquina`;
    buttonsModal.innerHTML = `
        <button class="buttonAddSala" id="buttonAdd" onclick="editarMaquina(${id})">
            Atualizar
        </button>

        <button class="buttonCancelarAddSala" onclick="fecharModal()">
            Cancelar
        </button>
    `;
}



function cadastrarMaquina() {

    const rotaAPI = '/maquina/cadastrar';
    const dados = {
        nomeServer: document.getElementById("nome").value,
        modeloServer: document.getElementById("modelo").value,
        numeroSerieServer: document.getElementById("numeroSerie").value,
        marcaServer: document.getElementById("marca").value,
        idEmpresaServer: sessionStorage.ID_EMPRESA,
        idSalaServer: sessionStorage.ID_SALA
    };

    const resposta = fetch(rotaAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    resposta.then(resposta => {
        console.log('Resposta da API:', resposta);

        if (resposta.ok) {
            fecharModal();
            window.alert("Máquina cadatrada")


        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
        }

    }).catch(erro => {
        console.error('Erro na requisição:', erro);
    });


}


function computadoresSalas(idSala) {

    sessionStorage.ID_SALA = idSala;
    window.location = "./computadores_sala.html";



}

async function listarMaquinaPorSala(idSala) {

    try {
        const rotaAPI = `maquina/listar/${idSala}`;
        const resposta = await fetch(rotaAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (resposta.ok) {
            const dados = await resposta.json();


            for (var i = 0; i < dados.length; i++) {

                try {
                    var respostaQtdMaquina = await fetch(`sala/buscarInfoMaquina/${idSala}`)
                    var dataQtdMaquina = await respostaQtdMaquina.json();


                } catch (erro) {
                    console.error('Erro na requisição:', erro);
                }


                document.getElementById("nomeSala").innerHTML = `${dataQtdMaquina.nomeSala} - ${dataQtdMaquina.totalMaquina} máquinas`

                var idMaquina = dados[i].idMaquina
                var nome = dados[i].nome
                var modelo = dados[i].modelo
                var marca = dados[i].marca
                var numSerie = dados[i].numero_serie
                var so = dados[i].sistema_operacional


                capturaComponente(idMaquina, 1, 1, "cpu")
                capturaComponente(idMaquina, 4, 2, "disco")
                capturaComponente(idMaquina, 3, 3, "ram")

             

            
                var sala = `
                <div class="salas">
                <a href="#" >
                    <div class="icons-acoes">
                        <button onclick="abrirModalEditarMaquina(${idMaquina}, '${nome}', '${modelo}', '${marca}', '${numSerie}')"><i class="bi bi-pencil-square"></i><button>
                        <button onclick="deletarMaquina(${idMaquina})"><i class="bi bi-trash3-fill"></i><button>
                    </div>
                    <div class="nomeSala">${nome}</div>
                    <div class="infopc-infostatus">
                        <div class="infopc">
                            <div class="iconePC">
                                <img src="../../assets/assets-dashboard/computer.svg" alt="">
                            </div>
                            <div class="expecificacoes">
                                <div class="tituloDados"><span style="font-weight: bold;">Marca:</span> ${marca}</div>
                                <div class="tituloDados"><span style="font-weight: bold;">Modelo:</span> ${modelo}</div>
                                <div class="tituloDados"><span style="font-weight: bold;">SO:</span> ${so}</div>
                            </div>
                        </div>
                        <div class="infostatus">
                            <div class="blocoStatusPc">
                                <div class="tituloStatus">STATUS</div>
                                <div class="registros">
                                    <div class="valores">
                                        <div class="tituloDados"><span style="font-weight: bold;">CPU: </span>
                                        <span id="cpu"></span>%</div>
                                        <div class="tituloDados"><span style="font-weight: bold;">Disco: </span>
                                        <span id="disco"></span>%</div>
                                        <div class="tituloDados"><span style="font-weight: bold;">Ram: </span>
                                        <span id="ram"></span>%</div>
                                    </div>
                                    <div class="icone">
                                        <img src="../../assets/assets-dashboard/alert-verde.svg" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>`

                miniContainerSalas.innerHTML += sala;

            }

        } else if (resposta.status === 404) {
            window.alert("Deu 404!");
        } else {
            throw `Houve um erro ao tentar realizar a postagem! Código da resposta: ${resposta.status}`;
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
    }
}


async function capturaComponente(maquina, componente, tipoDado, div){

    try {
        // Requisição para a CPU
        var resposta = await fetch(`maquina/valor/${maquina}/${componente}/${tipoDado}`);
        var uso = await resposta.json();
        console.log('Uso:', uso[0].valor);

        document.getElementById(`${div}`).innerHTML = uso[0].valor
    
    } catch (erro) {
        console.error('Erro na requisição do uso:', erro);
    }''

}


function editarMaquina(id) {

    console.log("entrando no editar");

    const rotaAPI = `/pages/dashboard/maquina/alterar/${id}`;
    const dados = {
        nomeServer: document.getElementById("nome").value,
        modeloServer: document.getElementById("modelo").value,
        numeroSerieServer: document.getElementById("numeroSerie").value,
        marcaServer: document.getElementById("marca").value,
    };

    const resposta = fetch(rotaAPI, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    resposta.then(resposta => {

        if (resposta.ok) {
            fecharModal();


        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
        }

    }).catch(erro => {
        console.error('Erro na requisição:', erro);
    });

}


async function deletarMaquina(idMaquina) {

    const rotaAPI = `/maquina/deletar/${idMaquina}`;

    const resposta = await fetch(rotaAPI, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    console.log(resposta)

    resposta.then(resposta => {


        if (resposta.ok) {
            window.alert("Sala deletada")

            fecharModal();


        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
        }

    }).catch(erro => {
        console.error('Erro na requisição:', erro);
    });




}
