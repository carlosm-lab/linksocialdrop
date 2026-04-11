"use client";

interface ExportButtonProps {
  label: string;
  views: number;
  clicks: number;
  ctr: string;
  leaderboard: { id: string; title: string; clicks: number }[];
}

export function ExportCsvButton({
  label,
  views,
  clicks,
  ctr,
  leaderboard,
}: ExportButtonProps) {
  const handleExport = () => {
    const BOM = "\uFEFF";
    let csv = BOM;

    // Summary header
    csv += "Metric,Value\n";
    csv += `Total Visits,${views}\n`;
    csv += `Unique Clicks,${clicks}\n`;
    csv += `CTR Avg,${ctr}%\n`;
    csv += "\n";

    // Leaderboard
    csv += "Rank,Link Title,Clicks\n";
    leaderboard.forEach((item, i) => {
      // Escape commas/quotes in the title
      const safeTitle = `"${item.title.replace(/"/g, '""')}"`;
      csv += `${String(i + 1).padStart(2, "0")},${safeTitle},${item.clicks}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linksocialdrop-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-surface-container-highest text-primary-container font-label hover:bg-surface-container-highest/80 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
    >
      {label}
    </button>
  );
}
