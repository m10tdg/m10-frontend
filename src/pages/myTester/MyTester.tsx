import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  FlaskConical,
  LoaderCircle,
  Plus,
  RefreshCw,
  Upload,
  XCircle,
} from "lucide-react";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";
import { useLangStore } from "@/shared/stores/langStore";
import {
  dashboardServiceApi,
  documentServiceApi,
  projectServiceApi,
  runServiceApi,
} from "@/shared/lib/api";
import { bg, danger, primary, success, warning } from "@/shared/styles/colors";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { useTenantId } from "@/features/auth/useTenantId";
import { myTesterTranslations } from "@/shared/config/translations/myTester";

type Project = {
  id: string;
  name: string;
  slug: string;
  qdrant_collection?: string;
  created_at?: string;
};

type RunReport = {
  id: string;
  format: string;
  downloadUrl: string;
  critical_count?: number;
  warning_count?: number;
};

type TestRun = {
  id: string;
  project_id?: string;
  url?: string;
  prompt?: string;
  status: string;
  created_at?: string;
  completed_at?: string | null;
  report?: RunReport | null;
};

function StatusPill({ status, label }: { status: string; label?: string }) {
  const normalized = status.toLowerCase();
  const isComplete = ["completed", "complete", "passed", "success"].includes(normalized);
  const isFailed = ["failed", "error"].includes(normalized);
  const color = isComplete ? success : isFailed ? danger : warning;
  const Icon = isComplete ? CheckCircle2 : isFailed ? XCircle : Clock3;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs capitalize"
      style={{ color, backgroundColor: `${color}18` }}
    >
      <Icon size={13} />
      {label ?? status}
    </span>
  );
}

export function MyTester() {
  const { lang } = useLangStore();
  const tx = myTesterTranslations[lang];
  const tenantId = useTenantId();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [docType, setDocType] = useState("requirement");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const projectRuns = useMemo(
    () => runs.filter((run) => run.project_id === selectedProjectId),
    [runs, selectedProjectId],
  );

  const loadProjects = useCallback(async () => {
    const response = await projectServiceApi.get<Project[]>("/projects", {
      params: { tenantId },
    });
    setProjects(response.data);
    setSelectedProjectId((current) =>
      response.data.some((project) => project.id === current)
        ? current
        : response.data[0]?.id ?? "",
    );
  }, [tenantId]);

  const loadRuns = useCallback(async (projectId: string) => {
    if (!projectId) return [];
    const response = await dashboardServiceApi.get<{ items: TestRun[] }>(
      `/projects/${projectId}/runs`,
      { params: { tenantId } },
    );
    return response.data.items;
  }, [tenantId]);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      try {
        await loadProjects();
      } catch (requestError) {
        if (!cancelled) setError(getApiErrorMessage(requestError));
      }
    };
    initialize();
    return () => {
      cancelled = true;
    };
  }, [loadProjects]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedProjectId) return;
    const refreshRuns = async () => {
      try {
        const projectRuns = await loadRuns(selectedProjectId);
        if (!cancelled) setRuns(projectRuns);
      } catch (requestError) {
        if (!cancelled) setError(getApiErrorMessage(requestError));
      }
    };
    refreshRuns();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId, loadRuns]);

  useEffect(() => {
    if (!runs.some((run) => ["queued", "running", "processing"].includes(run.status.toLowerCase()))) return;
    const timer = window.setInterval(() => {
      loadRuns(selectedProjectId)
        .then(setRuns)
        .catch((requestError: unknown) => setError(getApiErrorMessage(requestError)));
    }, 10000);
    return () => window.clearInterval(timer);
  }, [runs, loadRuns, selectedProjectId]);

  const withRequest = async (action: string, request: () => Promise<void>) => {
    setBusy(action);
    setNotice("");
    setError("");
    try {
      await request();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusy(null);
    }
  };

  const createProject = () =>
    withRequest("project", async () => {
      const response = await projectServiceApi.post<{ projectId: string }>("/projects", {
        tenantId,
        name: projectName.trim(),
        slug: projectSlug.trim(),
      });
      await loadProjects();
      setSelectedProjectId(response.data.projectId);
      setProjectName("");
      setProjectSlug("");
      setNotice(tx.notices.projectCreated);
    });

  const uploadDocument = () => {
    if (!selectedProjectId || !documentFile) return;
    withRequest("document", async () => {
      const form = new FormData();
      form.append("tenantId", tenantId);
      form.append("projectId", selectedProjectId);
      form.append("docType", docType);
      form.append("file", documentFile);
      await documentServiceApi.post("/documents/upload", form);
      setDocumentFile(null);
      setNotice(tx.notices.documentUploaded);
    });
  };

  const startTestRun = () => {
    if (!selectedProjectId) return;
    withRequest("run", async () => {
      const form = new FormData();
      form.append("tenantId", tenantId);
      form.append("projectId", selectedProjectId);
      form.append("url", testUrl.trim());
      form.append("prompt", prompt.trim());
      form.append("runSource", "ui");
      if (baselineFile) form.append("baseline", baselineFile);

      await runServiceApi.post<{ runId: string }>("/runs", form);
      setTestUrl("");
      setPrompt("");
      setBaselineFile(null);
      setRuns(await loadRuns(selectedProjectId));
      setNotice(tx.notices.runQueued);
    });
  };

  const refresh = () =>
    withRequest("refresh", async () => {
      await Promise.all([
        loadProjects(),
        selectedProjectId
          ? loadRuns(selectedProjectId).then(setRuns)
          : Promise.resolve(),
      ]);
    });

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleString(lang) : "—";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          lang={lang}
          notifCount={0}
          onNotifClick={() => setNotifPanelOpen(!notifPanelOpen)}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-0.5 text-gray-900" style={{ fontSize: "1.375rem" }}>{tx.title}</h1>
              <p className="text-sm text-gray-500">
                {tx.subtitle}
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={busy !== null}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 disabled:opacity-60"
            >
              {busy === "refresh" ? <LoaderCircle size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              {tx.refresh}
            </button>
          </div>

          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={17} />
              {error}
            </div>
          )}
          {notice && (
            <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={17} />
              {notice}
            </div>
          )}

          <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Plus size={17} style={{ color: primary }} />
              <h2 className="text-sm text-gray-800">{tx.createProject.title}</h2>
            </div>
            <form
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                void createProject();
              }}
            >
              <input
                aria-label={tx.createProject.name}
                required
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder={tx.createProject.name}
                className="min-w-0 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
              <input
                aria-label={tx.createProject.slug}
                required
                pattern="[a-zA-Z0-9-]+"
                title={tx.createProject.slugHint}
                value={projectSlug}
                onChange={(event) => setProjectSlug(event.target.value)}
                placeholder={tx.createProject.slugPlaceholder}
                className="min-w-0 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={busy !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60"
                style={{ backgroundColor: primary }}
              >
                {busy === "project" ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />}
                {tx.createProject.submit}
              </button>
            </form>
          </section>

          <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm text-gray-800">{tx.projects.title}</h2>
                <p className="mt-1 text-xs text-gray-500">{(projects.length === 1 ? tx.projects.countOne : tx.projects.countOther).replace("{count}", String(projects.length))}</p>
              </div>
              {projects.length > 0 && (
                <select
                  aria-label={tx.projects.select}
                  value={selectedProjectId}
                  onChange={(event) => setSelectedProjectId(event.target.value)}
                  className="max-w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name} · {project.slug}</option>
                  ))}
                </select>
              )}
            </div>
            {projects.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                {tx.projects.empty}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="cursor-pointer rounded-xl border p-4 text-left transition-colors"
                    style={{
                      borderColor: project.id === selectedProjectId ? primary : "#E5E7EB",
                      backgroundColor: project.id === selectedProjectId ? "#EEF2FF" : "#FFFFFF",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                        <FlaskConical size={17} style={{ color: primary }} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-gray-900">{project.name}</p>
                        <p className="truncate text-xs text-gray-500">{project.slug}</p>
                      </div>
                    </div>
                    <p className="mt-3 truncate text-xs text-gray-400" title={project.id}>{project.id}</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          {selectedProject && (
            <>
              <section className="mb-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Upload size={17} style={{ color: primary }} />
                    <h2 className="text-sm text-gray-800">{tx.upload.title}</h2>
                  </div>
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      uploadDocument();
                    }}
                  >
                    <select
                      value={docType}
                      onChange={(event) => setDocType(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
                      aria-label={tx.upload.docType}
                    >
                      <option value="requirement">{tx.upload.requirement}</option>
                      <option value="design">{tx.upload.design}</option>
                      <option value="other">{tx.upload.other}</option>
                    </select>
                    <input
                      required
                      type="file"
                      onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
                      className="block w-full rounded-xl border border-gray-200 p-2 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
                    />
                    <button
                      type="submit"
                      disabled={busy !== null || !documentFile}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-50"
                      style={{ backgroundColor: primary }}
                    >
                      {busy === "document" ? <LoaderCircle size={15} className="animate-spin" /> : <FileText size={15} />}
                      {tx.upload.submit}
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FlaskConical size={17} style={{ color: primary }} />
                    <h2 className="text-sm text-gray-800">{tx.run.title}</h2>
                  </div>
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      startTestRun();
                    }}
                  >
                    <input
                      required
                      type="url"
                      value={testUrl}
                      onChange={(event) => setTestUrl(event.target.value)}
                      placeholder="https://example.com"
                      aria-label={tx.run.url}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    />
                    <textarea
                      required
                      rows={3}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder={tx.run.promptPlaceholder}
                      aria-label={tx.run.prompt}
                      className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    />
                    <div>
                      <label htmlFor="baseline-file" className="mb-1.5 block text-xs text-gray-500">
                        {tx.run.baseline}
                      </label>
                      <input
                        id="baseline-file"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(event) => setBaselineFile(event.target.files?.[0] ?? null)}
                        className="block w-full rounded-xl border border-gray-200 p-2 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={busy !== null}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-50"
                      style={{ backgroundColor: primary }}
                    >
                      {busy === "run" ? <LoaderCircle size={15} className="animate-spin" /> : <FlaskConical size={15} />}
                      {tx.run.submit}
                    </button>
                  </form>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm text-gray-800">{tx.runs.title} · {selectedProject.name}</h2>
                    <p className="mt-1 text-xs text-gray-500">{tx.runs.subtitle}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    {(projectRuns.length === 1 ? tx.runs.countOne : tx.runs.countOther).replace("{count}", String(projectRuns.length))}
                  </span>
                </div>
                {projectRuns.length === 0 ? (
                  <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    {tx.runs.empty}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-500">
                          <th className="px-3 py-3 font-medium">{tx.runs.colRun}</th>
                          <th className="px-3 py-3 font-medium">{tx.runs.colStatus}</th>
                          <th className="px-3 py-3 font-medium">{tx.runs.colStarted}</th>
                          <th className="px-3 py-3 font-medium">{tx.runs.colReport}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectRuns.map((run) => (
                          <tr key={run.id} className="border-b border-gray-50 last:border-0">
                            <td className="max-w-sm px-3 py-3">
                              <p className="truncate text-gray-800" title={run.url}>{run.url || run.id}</p>
                              {run.prompt && (
                                <p className="mt-1 max-w-sm whitespace-pre-wrap break-words text-xs text-gray-500">
                                  {run.prompt}
                                </p>
                              )}
                              {/*<p className="mt-1 truncate text-xs text-gray-400" title={run.id}>{run.id}</p>*/}
                            </td>
                            <td className="px-3 py-3"><StatusPill status={run.status} label={tx.status[run.status.toLowerCase()]} /></td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-500">
                              {formatDate(run.created_at)}
                            </td>
                            <td className="px-3 py-3">
                              {run.report ? (
                                <div className="flex items-center gap-3">
                                  {run.report.downloadUrl && (
                                    <a
                                      href={run.report.downloadUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90"
                                      style={{ backgroundColor: primary }}
                                    >
                                      {run.report.format.toLowerCase() === "html" ? tx.runs.openHtmlReport : tx.runs.openReport} <ExternalLink size={13} />
                                    </a>
                                  )}
                                 {/*<span className="whitespace-nowrap text-xs text-gray-500">
                                    <span style={{ color: danger }}>{run.report.critical_count ?? 0} critical</span>
                                    {" · "}
                                    <span style={{ color: warning }}>{run.report.warning_count ?? 0} warnings</span>
                                  </span> */}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">{tx.runs.notAvailable}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="mt-4 text-xs text-gray-400">
                  {tx.runs.footer}
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
