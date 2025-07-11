import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import ToastContainer from '../components/ToastContainer';
import { useToast } from '../hooks/useToast';
import { categoriasApi } from '../services/api';
import { useExcelExport } from '../hooks/useExcelExport';

// Emojis para categorias - EXPANDIDO com muito mais opções
const icones = [
  // Alimentação & Bebidas
  '🍕', '🍔', '🍟', '🌭', '🍿', '🍽️', '🥘', '🍜', '🍱', '🍙', '🍯', '🥛', '☕', '🍵', '🧋', '🍺', '🍷', '🥂', '🍾', '🧊',
  
  // Transporte
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏍️', '🚲', '🛴', '✈️', '🚁', '🛫', '🚢', '⛽', '🚇', '🚊', '🚈', '🚝', '🚄', '🚅', '🛣️',
  
  // Casa & Lar
  '🏠', '🏡', '🏘️', '🏢', '🏬', '🏭', '🏗️', '🏚️', '🏟️', '🛏️', '🛋️', '🪑', '🚿', '🛁', '🧹', '🧽', '🧼', '🔧', '🔨', '⚡',
  
  // Saúde & Bem-estar
  '🏥', '💊', '💉', '🩺', '🦷', '👓', '🩹', '🧴', '🧘', '💆', '💇', '🧖', '💪', '🏃', '🚴', '⛹️', '🤸', '🏋️', '🧗', '🏊',
  
  // Entretenimento
  '🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎬', '📺', '📽️', '🎵', '🎶', '🎸', '🎹', '🥁', '🎤', '🎧', '📻', '🎺', '🎷', '🪗',
  
  // Compras & Varejo
  '🛒', '🛍️', '👕', '👖', '👗', '👠', '👜', '💄', '💍', '👔', '🧥', '👢', '🧢', '🎒', '💼', '🎁', '🛎️', '💳', '💰', '💸',
  
  // Educação & Trabalho
  '🎓', '📚', '✏️', '📝', '📖', '📑', '📊', '📈', '📉', '💻', '⌨️', '🖥️', '🖨️', '📱', '☎️', '📞', '📠', '📧', '✉️', '📮',
  
  // Lazer & Hobbies
  '🎪', '🎡', '🎢', '🎠', '🎳', '🎱', '🃏', '🧩', '🎨', '🖌️', '🖍️', '📷', '📸', '🔍', '🔭', '🌍', '🗺️', '🧭', '⛺', '🏕️',
  
  // Finanças & Negócios
  '💵', '💴', '💶', '💷', '💲', '💹', '💱', '🏦', '🏧', '💳', '💎', '⚖️', '📋', '📌', '📍', '🗂️', '📁', '📄', '📃', '🗃️',
  
  // Serviços & Utilidades
  '⚡', '💡', '🔌', '🔋', '📶', '📡', '📟', '⏰', '⏲️', '⏱️', '🕰️', '📅', '📆', '🗓️', '📇', '🗞️', '📰', '🏷️', '🔖', '📎',
  
  // Pets & Animais
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐸', '🐒', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺',
  
  // Viagem & Turismo
  '🧳', '🎒', '🗺️', '📍', '🗿', '🗽', '🏰', '🏯', '🏟️', '⛲', '⛱️', '🏖️', '🏝️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🎪',
  
  // Diversos
  '❤️', '💚', '💙', '💜', '🧡', '💛', '🖤', '🤍', '🤎', '💗', '💝', '💖', '💕', '⭐', '🌟', '✨', '🔥', '💯', '🎉', '🎊'
];
// Cores para categorias - EXPANDIDO com muito mais opções
const cores = [
  // Vermelhos
  '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#FCA5A5', '#F87171',
  
  // Azuis
  '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#93C5FD', '#60A5FA',
  
  // Verdes
  '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#6EE7B7', '#34D399',
  
  // Amarelos/Laranjas
  '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', '#FDE047', '#FACC15',
  '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#FB923C', '#F9A825',
  
  // Roxos/Violetas
  '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#C4B5FD', '#A78BFA',
  '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843', '#F9A8D4', '#F472B6',
  
  // Verdes escuros/Teal
  '#14B8A6', '#0D9488', '#0F766E', '#115E59', '#134E4A', '#5EEAD4', '#2DD4BF',
  '#84CC16', '#65A30D', '#4D7C0F', '#365314', '#1A2E05', '#BEF264', '#A3E635',
  
  // Índigos/Azuis escuros
  '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#A5B4FC', '#818CF8',
  
  // Cinzas/Neutros
  '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827', '#9CA3AF', '#D1D5DB',
  
  // Rosas/Magentas
  '#F472B6', '#E879F9', '#C084FC', '#A855F7', '#9333EA', '#8B5CF6', '#7C3AED',
  
  // Verdes limão
  '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#365314', '#BEF264', '#DCFCE7',
  
  // Ciano/Azul claro
  '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#67E8F9', '#22D3EE',
  
  // Marrons/Terra
  '#A16207', '#92400E', '#78350F', '#451A03', '#292524', '#D6D3D1', '#A8A29E'
];

interface Categoria {
  id: number;
  nome: string;
  cor: string;
  icone: string;
}

export default function Categorias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError, showSaveSuccess, showDeleteSuccess } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  
  // NOVO: Estados para exclusão inteligente
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(null);
  const [transacoesInfo, setTransacoesInfo] = useState<any>(null);
  const [selectedNewCategoria, setSelectedNewCategoria] = useState<number | null>(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    cor: cores[0],
    icone: icones[0]
  });

  // Hook para exportação Excel
  const { exportCategorias } = useExcelExport();

  // Verificar se usuário está carregado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Carregar categorias e estatísticas do backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar categorias sempre (prioritário)
      const categoriasData = await categoriasApi.getAll();
      setCategorias(categoriasData);
      
      // Tentar carregar estatísticas (opcional)
      try {
        const estatisticasData = await categoriasApi.getEstatisticas();
        setEstatisticas(estatisticasData);
      } catch (statsError) {
        console.warn('Erro ao carregar estatísticas:', statsError);
        // Manter estatísticas como null - página funcionará sem elas
        setEstatisticas(null);
      }
      
    } catch (error: any) {
      showError('Erro ao carregar', 'Não foi possível carregar as categorias');
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategoria) {
        // Editar categoria existente
        await categoriasApi.update(editingCategoria.id, formData);
        showSaveSuccess('Categoria atualizada');
      } else {
        // Criar nova categoria
        await categoriasApi.create(formData);
        showSaveSuccess('Categoria criada');
      }
      
      await loadData(); // Recarregar dados
      setShowModal(false);
      setEditingCategoria(null);
      setFormData({ nome: '', cor: cores[0], icone: icones[0] });
    } catch (error: any) {
      showError('Erro ao salvar', 'Não foi possível salvar a categoria');
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      cor: categoria.cor,
      icone: categoria.icone
    });
    setShowModal(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    try {
      // Primeiro, verificar se há transações nesta categoria
      const info = await categoriasApi.getTransacoesInfo(categoria.id);
      
      if (info.transacoes_count === 0) {
        // Se não há transações, excluir diretamente
        if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?\n\nEsta categoria não possui transações.`)) {
          await categoriasApi.delete(categoria.id);
          await loadData();
        }
      } else {
        // Se há transações, abrir modal de opções
        setDeletingCategoria(categoria);
        setTransacoesInfo(info);
        setSelectedNewCategoria(null);
        setShowDeleteModal(true);
      }
    } catch (error: any) {
      showError('Erro ao verificar', 'Não foi possível verificar a categoria');
      console.error('Erro ao verificar categoria:', error);
    }
  };

  // NOVO: Mover transações para outra categoria
  const handleMoverTransacoes = async () => {
    if (!deletingCategoria || !selectedNewCategoria) return;
    
    setIsProcessingDelete(true);
    try {
      // Mover transações
      const result = await categoriasApi.moverTransacoes(deletingCategoria.id, selectedNewCategoria);
      
      // Excluir categoria original (agora sem transações)
      await categoriasApi.delete(deletingCategoria.id);
      
      await loadData();
      setShowDeleteModal(false);
      setDeletingCategoria(null);
      setTransacoesInfo(null);
      
      showDeleteSuccess(`Categoria "${deletingCategoria.nome}" excluída e ${result.transacoes_movidas} transações movidas`);
    } catch (error: any) {
      showError('Erro ao mover', 'Não foi possível mover as transações');
      console.error('Erro ao mover transações:', error);
    } finally {
      setIsProcessingDelete(false);
    }
  };

  // NOVO: Excluir categoria e todas as transações
  const handleExcluirTudo = async () => {
    if (!deletingCategoria || !transacoesInfo) return;
    
    const confirmacao = confirm(
      `⚠️ ATENÇÃO - EXCLUSÃO PERMANENTE\n\n` +
      `Categoria: "${deletingCategoria.nome}"\n` +
      `Transações: ${transacoesInfo.transacoes_count}\n` +
      `Valor total: R$ ${transacoesInfo.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
      `Esta ação irá EXCLUIR PERMANENTEMENTE:\n` +
      `• A categoria "${deletingCategoria.nome}"\n` +
      `• Todas as ${transacoesInfo.transacoes_count} transações\n\n` +
      `⚠️ ESTA AÇÃO NÃO PODE SER DESFEITA!\n\n` +
      `Tem certeza que deseja continuar?`
    );
    
    if (!confirmacao) return;
    
    setIsProcessingDelete(true);
    try {
      const result = await categoriasApi.forcarExclusao(deletingCategoria.id);
      
      await loadData();
      setShowDeleteModal(false);
      setDeletingCategoria(null);
      setTransacoesInfo(null);
      
      showDeleteSuccess(`${result.message}`);
    } catch (error: any) {
      showError('Erro ao excluir', 'Não foi possível excluir a categoria');
      console.error('Erro ao excluir categoria:', error);
    } finally {
      setIsProcessingDelete(false);
    }
  };

  // NOVO: Cancelar exclusão
  const handleCancelarExclusao = () => {
    setShowDeleteModal(false);
    setDeletingCategoria(null);
    setTransacoesInfo(null);
    setSelectedNewCategoria(null);
  };

  const openCreateModal = () => {
    setEditingCategoria(null);
    setFormData({ nome: '', cor: cores[0], icone: icones[0] });
    setShowModal(true);
  };

  // NOVO: Função para exportar categorias para Excel
  const handleExportExcel = async () => {
    try {
      if (categorias.length === 0) {
        showError('Nenhuma categoria', 'Não há categorias para exportar');
        return;
      }

      // Enriquecer dados com estatísticas se disponível
      const categoriasComStats = categorias.map(categoria => {
        const stats = estatisticas?.categorias_com_stats?.find((s: any) => s.id === categoria.id);
        return {
          ...categoria,
          total_transacoes: stats?.total_transacoes || 0,
          valor_total: stats?.valor_total || 0,
          percentual_uso: stats?.percentual_uso || 0
        };
      });

      const sucesso = exportCategorias(categoriasComStats);
      
      if (sucesso) {
        showSuccess('Excel exportado!', `${categorias.length} categorias exportadas com sucesso`);
      } else {
        showError('Erro na exportação', 'Não foi possível exportar o arquivo Excel');
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      showError('Erro na exportação', 'Ocorreu um erro ao exportar o arquivo Excel');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation user={user} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-gray-400">Carregando categorias...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categorias</h1>
                <p className="text-slate-600 dark:text-gray-300">Organize seus gastos por categorias</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {/* NOVO: Botão de exportação Excel */}
              <button
                onClick={handleExportExcel}
                disabled={categorias.length === 0}
                className="bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 dark:disabled:bg-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Excel</span>
              </button>
              
              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nova Categoria</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Total de Categorias</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{estatisticas?.total_categorias || 0}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{estatisticas?.categorias_este_mes || 0} este mês</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Mais Utilizada</p>
                {estatisticas?.categoria_mais_usada ? (
                  <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{estatisticas.categoria_mais_usada.icone}</span>
                    <span>{estatisticas.categoria_mais_usada.nome}</span>
                  </p>
                ) : (
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Nenhuma</p>
                )}
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  {estatisticas?.categoria_mais_usada ? 
                    `${estatisticas.categoria_mais_usada.percentual_uso}% dos gastos` : 
                    'Sem transações'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Status</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {estatisticas?.todas_ativas ? 'Todas Ativas' : 'Verificar Status'}
                </p>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Sistema organizado</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-medium shadow-lg"
                        style={{ backgroundColor: categoria.cor }}
                      >
                        {categoria.icone}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{categoria.nome}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Categoria ativa</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: categoria.cor }}
                      ></div>
                      <span className="text-sm text-slate-600 dark:text-gray-300 font-medium">{categoria.cor}</span>
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(categoria)}
                        className="w-8 h-8 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-4">
                  <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: categoria.cor + '80',
                        width: (() => {
                          const stats = estatisticas?.categorias_com_stats?.find((s: any) => s.id === categoria.id);
                          return stats && stats.total_transacoes > 0 ? `${Math.min(stats.percentual_uso, 100)}%` : '5%';
                        })()
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                    {(() => {
                      const stats = estatisticas?.categorias_com_stats?.find((s: any) => s.id === categoria.id);
                      return stats ? `${stats.total_transacoes} transações este mês` : 'Nenhuma transação';
                    })()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Nenhuma categoria cadastrada
            </h3>
            <p className="text-slate-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Crie sua primeira categoria para começar a organizar suas finanças de forma inteligente
            </p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Criar Primeira Categoria
            </button>
          </div>
        )}
      </div>

      {/* NOVA: Modal de Exclusão Inteligente */}
      {showDeleteModal && deletingCategoria && transacoesInfo && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/50 dark:border-gray-700 overflow-hidden max-h-[90vh]">
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-medium shadow-lg"
                    style={{ backgroundColor: deletingCategoria.cor }}
                  >
                    {deletingCategoria.icone}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Excluir Categoria</h2>
                    <p className="text-slate-600 dark:text-gray-300">"{deletingCategoria.nome}" possui transações</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelarExclusao}
                  className="w-8 h-8 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Informações da categoria */}
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{transacoesInfo.transacoes_count}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Transações</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      R$ {transacoesInfo.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Valor Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{transacoesInfo.transacoes_exemplo.length}</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Recentes</p>
                  </div>
                </div>

                {/* Exemplos de transações */}
                {transacoesInfo.transacoes_exemplo.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Últimas transações:</p>
                    <div className="space-y-2">
                      {transacoesInfo.transacoes_exemplo.slice(0, 3).map((transacao: any) => (
                        <div key={transacao.id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-gray-300 truncate mr-2">{transacao.descricao}</span>
                          <span className={`font-medium ${transacao.tipo === 'ENTRADA' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transacao.tipo === 'ENTRADA' ? '+' : '-'}R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      {transacoesInfo.transacoes_exemplo.length > 3 && (
                        <p className="text-xs text-slate-500 dark:text-gray-400 text-center">
                          ... e mais {transacoesInfo.transacoes_exemplo.length - 3} transações
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Opções de exclusão */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">O que deseja fazer?</h3>

                {/* Opção 1: Mover transações */}
                <div className="border border-slate-200 dark:border-gray-600 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l4-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Mover todas as transações para outra categoria
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-gray-300 mb-3">
                        As {transacoesInfo.transacoes_count} transações serão transferidas para a categoria selecionada, 
                        depois a categoria "{deletingCategoria.nome}" será excluída.
                      </p>
                      <select
                        value={selectedNewCategoria || ''}
                        onChange={(e) => setSelectedNewCategoria(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full border border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias
                          .filter(cat => cat.id !== deletingCategoria.id)
                          .map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.icone} {categoria.nome}
                            </option>
                          ))
                        }
                      </select>
                      {selectedNewCategoria && (
                        <button
                          onClick={handleMoverTransacoes}
                          disabled={isProcessingDelete}
                          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingDelete ? 'Movendo...' : `Mover e Excluir Categoria`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Opção 2: Excluir tudo */}
                <div className="border border-red-200 dark:border-red-800 rounded-2xl p-4 bg-red-50/50 dark:bg-red-900/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
                        Excluir categoria e todas as transações
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                        ⚠️ <strong>ATENÇÃO:</strong> Esta ação excluirá permanentemente a categoria "{deletingCategoria.nome}" 
                        e todas as {transacoesInfo.transacoes_count} transações. Esta ação não pode ser desfeita!
                      </p>
                      <button
                        onClick={handleExcluirTudo}
                        disabled={isProcessingDelete}
                        className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingDelete ? 'Excluindo...' : `Excluir Tudo Permanentemente`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão cancelar */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCancelarExclusao}
                  className="px-6 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/50 dark:border-gray-700 overflow-hidden max-h-[90vh]">
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full border border-slate-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 transition-all duration-200 bg-slate-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Ex: Alimentação, Transporte..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                    Ícone ({icones.length} opções disponíveis)
                  </label>
                  <div className="max-h-48 overflow-y-auto bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4 border border-slate-200 dark:border-gray-600">
                    <div className="grid grid-cols-8 gap-2">
                      {icones.map((icone) => (
                        <button
                          key={icone}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icone }))}
                          className={`p-2 rounded-lg border-2 text-xl hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm transition-all duration-200 ${
                            formData.icone === icone 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-200 dark:ring-blue-600' 
                              : 'border-transparent hover:border-slate-300 dark:hover:border-gray-500 bg-white/70 dark:bg-gray-700/70'
                          }`}
                          title={`Selecionar ícone: ${icone}`}
                        >
                          {icone}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                    💡 Role para ver todos os ícones disponíveis
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                    Cor ({cores.length} opções disponíveis)
                  </label>
                  <div className="max-h-32 overflow-y-auto bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4 border border-slate-200 dark:border-gray-600">
                    <div className="grid grid-cols-10 gap-2">
                      {cores.map((cor) => (
                        <button
                          key={cor}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, cor }))}
                          className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 ${
                            formData.cor === cor 
                              ? 'border-slate-800 dark:border-gray-300 ring-2 ring-slate-400 dark:ring-gray-300 scale-110 shadow-lg' 
                              : 'border-white dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: cor }}
                          title={`Cor: ${cor}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      💡 Role para ver todas as cores disponíveis
                    </p>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border border-slate-300 dark:border-gray-600"
                        style={{ backgroundColor: formData.cor }}
                      />
                      <span className="text-xs text-slate-600 dark:text-gray-300 font-mono">{formData.cor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {editingCategoria ? 'Salvar Alterações' : 'Criar Categoria'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast}
        position="top-right"
      />
    </div>
  );
} 