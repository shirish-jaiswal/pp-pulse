"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Pencil, Save, X, Copy, Eye, EyeOff,
  Terminal, ShieldCheck, RefreshCcw, Trash2
} from "lucide-react";
import { getSessionData } from "@/utils/storage/local/session-operations";
import { setLocal, omitLocal } from "@/utils/storage/local/crud";
import { LocalStorageKeys } from "@/utils/storage/local/keys";
import { SessionConfig } from "@/types/session";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SessionData() {
  const initialSession = getSessionData();
  const [data, setData] = useState<SessionConfig | null>(initialSession);
  const [isEditing, setIsEditing] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [editForm, setEditForm] = useState<SessionConfig | null>(initialSession);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Token copied to clipboard", { duration: 1500 });
  };

  const handleSave = () => {
    if (!editForm) return;
    setLocal(LocalStorageKeys.KEY_JSESSIONID, editForm.jsessionId);
    setLocal(LocalStorageKeys._oauth2_proxy_0, editForm.oAuthCookie1);
    setLocal(LocalStorageKeys._oauth2_proxy_1, editForm.oAuthCookie2);
    setLocal(LocalStorageKeys.sid, editForm.sid);

    setData(editForm);
    setIsEditing(false);
    toast.success("Session configuration synchronized");
  };

  // --- NEW: Delete Session Logic ---
  const handleDeleteSession = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all session tokens? This will log you out.");
    
    if (confirmDelete) {
      omitLocal(LocalStorageKeys.KEY_JSESSIONID);
      omitLocal(LocalStorageKeys._oauth2_proxy_0);
      omitLocal(LocalStorageKeys._oauth2_proxy_1);
      omitLocal(LocalStorageKeys.sid);

      setData(null);
      setEditForm(null);
      toast.error("Session data cleared successfully");
    }
  };

  if (!data) return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <p className="text-slate-500 mb-4">No active session data found.</p>
      <Button onClick={() => window.location.reload()} variant="outline">
        <RefreshCcw className="w-4 h-4 mr-2" /> Reload Page
      </Button>
    </div>
  );

  const fields = [
    { id: "jsessionId", label: "JSESSIONID", value: data.jsessionId },
    { id: "oAuthCookie1", label: "OAuth Cookie P1", value: data.oAuthCookie1 },
    { id: "oAuthCookie2", label: "OAuth Cookie P2", value: data.oAuthCookie2 },
    { id: "sid", label: "System ID (SID)", value: data.sid },
  ];

  const combinedCookie = [
    { key: "_oauth2_proxy_0", value: data.oAuthCookie1 },
    { key: "_oauth2_proxy_1", value: data.oAuthCookie2 },
    { key: "sid", value: data.sid }
  ]
    .filter(item => item.value)
    .map(item => `${item.key}=${item.value}`)
    .join(";");

  const copyAllCookies = () => {
    handleCopy(combinedCookie);
    toast.success("Full cookie string copied");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 antialiased">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Environment Session Explorer
            </h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 ml-2">
              <ShieldCheck className="w-3 h-3 mr-1" /> Active
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Internal session management for PP Pulse. Modify local storage tokens directly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* NEW: Delete Button */}
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteSession}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Session
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
            className="text-slate-600"
          >
            {showSecrets ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showSecrets ? "Hide Tokens" : "Reveal Tokens"}
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            variant={isEditing ? "destructive" : "default"}
            size="sm"
            onClick={() => {
              if (isEditing) setEditForm(data);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Rest of the component (Combined Cookie and Table) remains the same... */}
      {!isEditing && (
        <div className="mb-4 p-4 bg-slate-900 rounded-lg border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Combined Proxy & SID Cookie
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAllCookies}
              className="h-7 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-800"
            >
              <Copy className="w-3 h-3 mr-2" /> Copy Full String
            </Button>
          </div>
          <code className="text-[12px] font-mono text-emerald-400 break-all block leading-relaxed">
            {showSecrets ? combinedCookie : "********************************************************"}
          </code>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-200 px-6 py-3 grid grid-cols-12 gap-4">
          <div className="col-span-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Parameter</div>
          <div className="col-span-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">Value</div>
        </div>

        <div className="divide-y divide-slate-100">
          {fields.map((field) => (
            <div key={field.id} className="px-6 py-4 grid grid-cols-12 gap-4 hover:bg-slate-50/30 transition-colors items-center">
              <div className="col-span-4">
                <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
                  {field.label}
                </Label>
              </div>

              <div className="col-span-8 flex items-center gap-3">
                {isEditing ? (
                  <Input
                    id={field.id}
                    value={editForm?.[field.id as keyof SessionConfig] || ""}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, [field.id]: e.target.value } : null)}
                    className="h-9 font-mono text-xs bg-white border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <>
                    <div className="flex-1 font-mono text-[13px] text-slate-600 truncate bg-slate-100/50 px-3 py-1.5 rounded border border-slate-200/60 group relative">
                      {showSecrets
                        ? (field.value || "—")
                        : (field.value ? "••••••••••••••••••••••••" : "—")
                      }
                    </div>
                    {field.value && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleCopy(field.value)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {isEditing && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end items-center gap-4">
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <RefreshCcw className="w-3 h-3 animate-spin-reverse" />
              Applying changes updates LocalStorage keys immediately.
            </span>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 h-9 shadow-sm px-6">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400 italic">
        Authorized Access Only. All session modifications are tracked via local state.
      </p>
    </div>
  );
}