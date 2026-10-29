/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  X, 
  Volume2, 
  VolumeX, 
  Edit3, 
  RotateCcw,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Task, FilterType, Priority } from './types/todo.ts';
import { playSound } from './utils/audio.ts';

const STORAGE_KEY = 'todo_list_tasks';
const SOUND_KEY = 'todo_sound_enabled';

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    text: 'Comprar ingredientes para o jantar',
    completed: false,
    createdAt: Date.now() - 3600000,
    priority: 'normal',
    category: 'Casa'
  },
  {
    id: 'task-2',
    text: 'Revisar relatório do projeto',
    completed: true,
    createdAt: Date.now() - 7200000,
    priority: 'alta',
    category: 'Trabalho'
  },
  {
    id: 'task-3',
    text: 'Estudar conceitos de JavaScript e DOM',
    completed: false,
    createdAt: Date.now() - 1800000,
    priority: 'alta',
    category: 'Estudos'
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  const [filter, setFilter] = useState<FilterType>('all');
  const [inputText, setInputText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  });

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Save tasks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Erro ao salvar tarefas:', e);
    }
  }, [tasks]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem(SOUND_KEY, soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Trigger audio feedback
  const triggerAudio = (type: 'complete' | 'uncomplete' | 'add' | 'delete' | 'all-done') => {
    if (soundEnabled) {
      playSound(type);
    }
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;

    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: clean,
      completed: false,
      createdAt: Date.now(),
      priority: selectedPriority
    };

    setTasks(prev => [newTask, ...prev]);
    setInputText('');
    triggerAudio('add');
    if (addInputRef.current) {
      addInputRef.current.focus();
    }
  };

  // Toggle complete
  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;

      const nextCompleted = !target.completed;
      const updated = prev.map(t => t.id === id ? { ...t, completed: nextCompleted } : t);

      if (nextCompleted) {
        triggerAudio('complete');

        // Check if all tasks are now completed
        const pendingCount = updated.filter(t => !t.completed).length;
        if (pendingCount === 0 && updated.length > 0) {
          triggerAudio('all-done');
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        triggerAudio('uncomplete');
      }

      return updated;
    });
  };

  // Delete task
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
    triggerAudio('delete');
  };

  // Start inline editing
  const handleStartEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditingText(task.text);
  };

  // Save inline edit
  const handleSaveEdit = (id: string) => {
    const clean = editingText.trim();
    if (clean) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, text: clean } : t));
    }
    setEditingId(null);
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;
    setTasks(prev => prev.filter(t => !t.completed));
    triggerAudio('delete');
  };

  // Reset to initial demo tasks
  const handleResetDemo = () => {
    if (window.confirm('Deseja restaurar as tarefas de exemplo iniciais?')) {
      setTasks(INITIAL_TASKS);
      setFilter('all');
      setSearchQuery('');
    }
  };

  // Derived statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (searchQuery.trim()) {
      return task.text.toLowerCase().includes(searchQuery.toLowerCase().trim());
    }
    return true;
  });

  // Format date helper
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
      return `Hoje às ${hours}:${minutes}`;
    }
    return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Container Principal */}
      <div className="w-full max-w-[580px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300">
        
        {/* Cabeçalho */}
        <header className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl shadow-inner text-indigo-600 flex-shrink-0">
              📝
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight flex items-center gap-2">
                Minhas Tarefas
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Organize suas atividades diárias com facilidade
              </p>
            </div>
          </div>

          {/* Quick Actions (Sound toggle & Reset) */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title={soundEnabled ? 'Sons ativados (clique para silenciar)' : 'Sons silenciados (clique para ativar)'}
              aria-label="Alternar som"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Restaurar tarefas padrão"
              aria-label="Restaurar tarefas padrão"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </header>

        {/* Resumo / Estatísticas das Tarefas */}
        <section className="grid grid-cols-3 gap-3 mb-6" aria-label="Estatísticas de tarefas">
          {/* Total */}
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`p-3.5 text-center rounded-xl border transition-all duration-200 cursor-pointer text-left ${
              filter === 'all'
                ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5'
            }`}
          >
            <span className="block text-2xl font-extrabold text-indigo-600 text-center">
              {totalCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mt-0.5">
              Total
            </span>
          </button>

          {/* Pendentes */}
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`p-3.5 text-center rounded-xl border transition-all duration-200 cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5'
            }`}
          >
            <span className="block text-2xl font-extrabold text-amber-500 text-center">
              {pendingCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mt-0.5">
              Pendentes
            </span>
          </button>

          {/* Concluídas */}
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`p-3.5 text-center rounded-xl border transition-all duration-200 cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5'
            }`}
          >
            <span className="block text-2xl font-extrabold text-emerald-500 text-center">
              {completedCount}
            </span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mt-0.5">
              Concluídas
            </span>
          </button>
        </section>

        {/* Barra de Progresso Visual */}
        {totalCount > 0 && (
          <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1.5">
              <span>Progresso geral</span>
              <span className="font-bold text-slate-700">{progressPercent}% concluído</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Formulário para Adicionar Tarefa */}
        <form onSubmit={handleAddTask} className="mb-5" id="todoForm">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                ref={addInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="O que você precisa fazer hoje?"
                autoComplete="off"
                required
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-[15px] placeholder-slate-400 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              id="addBtn"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[15px] px-5 py-3 rounded-xl shadow-md shadow-indigo-600/20 active:translate-y-0 hover:-translate-y-0.5 transition-all cursor-pointer flex-shrink-0"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Opção rápida de prioridade */}
          <div className="flex items-center gap-2 mt-2.5 px-1 text-xs text-slate-500">
            <span className="font-medium">Prioridade:</span>
            <div className="flex gap-1.5">
              {(['baixa', 'normal', 'alta'] as Priority[]).map((p) => {
                const isSelected = selectedPriority === p;
                const colors = {
                  baixa: isSelected ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-slate-600 border-slate-200 hover:bg-slate-100',
                  normal: isSelected ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'text-slate-600 border-slate-200 hover:bg-slate-100',
                  alta: isSelected ? 'bg-amber-100 text-amber-700 border-amber-300' : 'text-slate-600 border-slate-200 hover:bg-slate-100'
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2 py-0.5 rounded-full border text-[11px] font-medium capitalize transition-all cursor-pointer ${colors[p]}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Barra de Filtros e Busca */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3.5 border-b border-slate-200 flex-wrap">
          {/* Botões de Filtro */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg" role="tablist">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              role="tab"
              aria-selected={filter === 'all'}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                filter === 'pending'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              role="tab"
              aria-selected={filter === 'pending'}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              role="tab"
              aria-selected={filter === 'completed'}
            >
              Concluídas ({completedCount})
            </button>
          </div>

          {/* Busca e Limpar Concluídas */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowSearch(prev => !prev);
                if (showSearch) setSearchQuery('');
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                showSearch || searchQuery 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Pesquisar tarefas"
              aria-label="Pesquisar tarefas"
            >
              <Search size={16} />
            </button>

            {completedCount > 0 && (
              <button
                type="button"
                id="clearCompletedBtn"
                onClick={handleClearCompleted}
                className="text-xs text-slate-500 hover:text-rose-600 hover:underline px-2 py-1 rounded transition-colors cursor-pointer"
                title="Remover tarefas concluídas"
              >
                Limpar concluídas ({completedCount})
              </button>
            )}
          </div>
        </div>

        {/* Input de Busca Condicional */}
        {showSearch && (
          <div className="relative mb-3 animate-fadeIn">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar tarefas por palavra-chave..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Lista de Tarefas */}
        <main>
          {filteredTasks.length > 0 ? (
            <ul
              id="taskList"
              className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar"
              aria-live="polite"
            >
              {filteredTasks.map((task) => {
                const isEditing = editingId === task.id;

                return (
                  <li
                    key={task.id}
                    className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                      task.completed
                        ? 'border-l-[5px] border-l-emerald-500 bg-slate-50/90 border-slate-200/80 opacity-80 hover:opacity-100 hover:shadow-xs'
                        : 'border-l-[5px] border-l-indigo-600 bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:border-l-indigo-700 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Conteúdo Principal da Tarefa */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox Circular */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : 'border-slate-400 bg-transparent hover:border-indigo-600 hover:bg-indigo-50 hover:scale-105'
                        }`}
                        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                      >
                        {task.completed && <Check size={14} strokeWidth={3} />}
                      </button>

                      {/* Informações da Tarefa */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(task.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="w-full text-sm text-slate-800 border-2 border-indigo-400 rounded-md px-2 py-1 outline-none bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(task.id)}
                              className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700"
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <p
                              onClick={() => handleToggleTask(task.id)}
                              className={`text-[15px] leading-relaxed break-words cursor-pointer select-none transition-all ${
                                task.completed
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-800 font-medium'
                              }`}
                            >
                              {task.text}
                            </p>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {/* Badge de Status */}
                              <span
                                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  task.completed
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {task.completed ? '✓ Concluída' : '⏳ Pendente'}
                              </span>

                              {/* Badge de Prioridade */}
                              {task.priority && task.priority !== 'normal' && (
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    task.priority === 'alta'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              )}

                              {/* Timestamp */}
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Calendar size={11} />
                                {formatTime(task.createdAt)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Ações Laterais (Editar e Excluir) */}
                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(task, e)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Editar tarefa"
                          title="Editar tarefa"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Excluir tarefa"
                          title="Excluir tarefa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            /* Estado Vazio */
            <div id="emptyState" className="text-center py-10 px-4">
              <div className="w-16 h-16 mx-auto mb-3.5 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                {filter === 'completed' ? (
                  '📋'
                ) : filter === 'pending' && totalCount > 0 ? (
                  '🎉'
                ) : searchQuery ? (
                  <Search size={28} />
                ) : (
                  <Sparkles size={28} className="text-amber-500 animate-pulse" />
                )}
              </div>

              <p className="text-base font-bold text-slate-800">
                {searchQuery
                  ? 'Nenhuma tarefa encontrada para esta busca'
                  : filter === 'completed'
                  ? 'Nenhuma tarefa concluída ainda'
                  : filter === 'pending' && totalCount > 0
                  ? 'Parabéns! Tudo concluído!'
                  : 'Nenhuma tarefa encontrada.'}
              </p>

              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {searchQuery
                  ? 'Tente pesquisar por outros termos ou limpe o campo de busca.'
                  : filter === 'completed'
                  ? 'Conclua tarefas clicando no círculo ao lado de cada uma para vê-las aqui.'
                  : filter === 'pending' && totalCount > 0
                  ? 'Você não possui tarefas pendentes no momento. Bom descanso!'
                  : 'Adicione uma nova tarefa acima para começar seu dia com produtividade!'}
              </p>
            </div>
          )}
        </main>

        {/* Rodapé explicativo */}
        <footer className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <AlertCircle size={13} className="text-slate-400" />
            <span>Dica: Clique no círculo para concluir uma tarefa ou na lixeira para excluí-la.</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
