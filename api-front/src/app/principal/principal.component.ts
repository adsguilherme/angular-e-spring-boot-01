import { Component } from '@angular/core';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  // Objeto do tipo Cliente
  cliente = new Cliente();

  // Variável para visibilidade dos botões
  btnCadastro:boolean = true;

  // Variável para visibilidade da tabela
  tabela:boolean = true;

  // JSON de clientes (vai armazenar o quem vem da API)
  clientes:Cliente[] = [];

  //Construtor
  constructor(private servico:ClienteService, private toastr:ToastrService){}

  // Metodo/funcao de seleção
  selecionar():void{
    this.servico.selecionar()
      .subscribe(retorno => this.clientes = retorno);
  }

  // Metodo/funcao de cadastro
  cadastrar():void{
    // Verificar se os campos estao preenchidos
    if(this.cliente.nome == '' || this.cliente.idade == 0 || this.cliente.cidade == ''){
       this.toastr.error('Preencha todos os campos!', 'Erro');
       return;
    }

    this.servico.cadastrar(this.cliente)
      .subscribe({
        next: retorno => {
          // Cadastrar o cliente no vetor
          this.clientes.push(retorno);

          // Limpar formulário
          this.cliente = new Cliente();

          // Mensagem
          this.toastr.success('Cliente cadastrado com sucesso!', 'Sucesso');
        },
        error: erro => {
          // Mensagem de erro
          if(erro.status == 0){
             this.toastr.error('Serviço indisponível. Tente novamente mais tarde.', 'Erro');
          }
        }
      });
  }

  // Metodo/funcao para selecionar um cliente específico
  selecionarCliente(posicao:number):void{

    // Selecionar cliente no vetor
    this.cliente = this.clientes[posicao];

    // Visibilidade dos botões
    this.btnCadastro = false
    
    // Visibilidade da tabela
    this.tabela = false;
  }

  // Metodo/funcao para editar clientes
  editar():void{
    this.servico.editar(this.cliente)
      .subscribe(retorno => {

        // Obter a posicao do cliente no vetor
        let posicao = this.clientes.findIndex(obj => {
          return obj.codigo == retorno.codigo;
        });

        // Alterar os dados do cliente no vetor
        this.clientes[posicao] = retorno;

        // Limpar formulário
        this.cliente = new Cliente();

        // Visibilidade dos botões
        this.btnCadastro = true;

        // Visibilidade da tabela
        this.tabela = true;

        // Mensagem
        this.toastr.success('Cliente editado com sucesso!', 'Sucesso');
    });
  }

  // Metodo/funcao para remover clientes
  remover():void{
    this.servico.remover(this.cliente.codigo)
      .subscribe(() => {
        
        // Remover o cliente do vetor
        this.clientes = this.clientes.filter(obj => {
          return obj.codigo != this.cliente.codigo;
        });

        // Limpar formulário
        this.cliente = new Cliente();

        // Visibilidade dos botões
        this.btnCadastro = true;

        // Visibilidade da tabela
        this.tabela = true;

        // Mensagem
        this.toastr.success('Cliente removido com sucesso!', 'Sucesso');
    });
  }

  // Método para cancelar
  cancelar():void{
    this.cliente = new Cliente();
    this.btnCadastro = true;
    this.tabela = true;
  }

  // Metodo/funcao de inicializacao
  ngOnInit(){
    this.selecionar();
  }
}
