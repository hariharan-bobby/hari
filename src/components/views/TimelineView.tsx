import React, { useState } from 'react';
import { Clock, Calendar, Mic, CheckCircle2, Play, Pause, ExternalLink } from 'lucide-react';
import type { TimelineEvent, MemoryItem } from '../../types/memory';

interface TimelineViewProps {
  events: TimelineEvent[];
  memories: MemoryItem[];
  onOpenDocModal: (doc: MemoryItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, memories, onOpenDocModal }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => filterType === 'all' || e.type === filterType);

  const toggleAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header & Filter */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" /> Chronological Activity Feed
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Memory Timeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track events, emails, audio transcripts, calendar deadlines, and document updates chronologically.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['all', 'calendar', 'pdf', 'meeting', 'audio', 'image'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all ${
                filterType === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Feed */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-slate-300 dark:before:to-slate-800">
        {filteredEvents.map((evt) => {
          const matchedDoc = memories.find((m) => m.id === evt.sourceDocId);
          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Point */}
              <div className="absolute -left-6 md:-left-10 top-1 w-6 h-6 rounded-full bg-blue-600 text-white ring-4 ring-white dark:ring-slate-950 flex items-center justify-center shadow-md text-xs font-bold">
                {evt.type === 'audio' ? <Mic className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
              </div>

              {/* Event Card */}
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {evt.title}
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {evt.type}
                    </span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {evt.date} • {evt.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                {/* Audio Simulator Player if audio event */}
                {evt.type === 'audio' && (
                  <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                    <button
                      onClick={() => toggleAudio(evt.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
                    >
                      {playingAudioId === evt.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div className="flex-1 mx-4 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Whisper AI Audio Recording</span>
                        <span>{playingAudioId === evt.id ? '00:14 / 45:00' : '45:00'}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`bg-blue-500 h-full transition-all duration-300 ${
                            playingAudioId === evt.id ? 'w-1/3 animate-pulse' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action item badge if present */}
                {evt.actionItem && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Action Item: {evt.actionItem}</span>
                  </div>
                )}

                {/* Link to doc */}
                {matchedDoc && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onOpenDocModal(matchedDoc)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Open Attached Memory ({matchedDoc.title}) <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
