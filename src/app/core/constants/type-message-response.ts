import { MessageResponse } from '@core/model/message-response.model';

export const SUCCESS_200: MessageResponse = {
  type: 'success',
  code: 200,
  message: 'Sucesso',
};

export const SUCCESS_200_LOGIN: MessageResponse = {
  type: 'success',
  code: 200,
  message: 'Login realizado com sucesso! Sejá bem vindo(a)!',
};

export const SUCCESS_200_CHANGED_PASSWORD: MessageResponse = {
  type: 'success',
  code: 200,
  message: 'Sua senha foi alterada com sucesso!',
};

export const SUCCESS_201: MessageResponse = {
  type: 'success',
  code: 201,
  message: 'Registro criado com sucesso',
};

export const SUCCESS_203: MessageResponse = {
  type: 'success',
  code: 203,
  message: 'Delete realizado!',
};

export const SUCCESS_204: MessageResponse = {
  type: 'success',
  code: 204,
  message: 'Sua requisição não retornou conteúdo.',
};

export const ERROR_400: MessageResponse = {
  type: 'error',
  code: 400,
  message: 'Requisição inválida',
  detailedMessage: 'O servidor não entendeu a requisição pois recebeu uma sintaxe inválida',
};

export const ERROR_401: MessageResponse = {
  type: 'error',
  code: 401,
  message: 'Não autorizado',
  detailedMessage:
    'Sua sessão expirou, ou você não tem permissão de acesso. Tente efetuar o login novamente.',
};

export const ERROR_401_EXPIRED: MessageResponse = {
  type: 'error',
  code: 401,
  message: 'Sua sessão expirou!',
  detailedMessage:
    'Sua sessão expirou, ou você não tem permissão de acesso. Tente efetuar o login novamente.',
};

export const ERROR_403: MessageResponse = {
  type: 'error',
  code: 403,
  message: 'Acesso negado',
  detailedMessage: 'O usuário logado não tem direitos de acesso ao conteúdo.',
};

export const ERROR_404_LOGIN: MessageResponse = {
  type: 'error',
  code: 404,
  message: 'Usuário não encontrado.',
  detailedMessage: '',
};

export const ERROR_406: MessageResponse = {
  type: 'error',
  code: 406,
  message: 'Os dados enviados não foram aceitos pelo servidor.',
  detailedMessage: 'Os dados enviados estão incorretos ou inválidos para esta requisição.',
};

export const ERROR_408: MessageResponse = {
  type: 'error',
  code: 408,
  message: 'Requisição expirada',
  detailedMessage: 'O tempo de validade da requisição expirou.',
};

export const ERROR_409: MessageResponse = {
  type: 'error',
  code: 409,
  message: 'Cadastro duplicado',
  detailedMessage: 'Verifique os itens cadastrados',
};

export const ERROR_422: MessageResponse = {
  type: 'error',
  code: 422,
  message: 'Entidade não processada',
  detailedMessage:
    'A requisição está bem formada, mas inabilitada para ser seguida devido a erros semânticos.',
};

export const ERROR_500: MessageResponse = {
  type: 'error',
  code: 500,
  message: 'Erro interno no servidor',
  detailedMessage: 'Uma condição  inesperada foi encontrada, e a solicitação não foi atendida.',
};

export const ERROR_502: MessageResponse = {
  type: 'error',
  code: 502,
  message: 'Bad Gateway',
  detailedMessage:
    'O servidor estava trabalhando como gateway e recebeu uma resposta inválida.',
};
