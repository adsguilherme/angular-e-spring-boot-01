import { Component } from '@angular/core';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';

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

  // JSON de clientes (vai armazenar o quem vem da API)
  clientes:Cliente[] = [];

  //Construtor
  constructor(private servico:ClienteService){}

  // Metodo/funcao de seleção
  selecionar():void{
    this.servico.selecionar()
      .subscribe(retorno => this.clientes = retorno);
  }

  // Metodo/funcao de inicializacao
  ngOnInit(){
    this.selecionar();
  }
}
