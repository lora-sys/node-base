"use client";

export function AuthBackground({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
			{/* 装饰性背景元素 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* 顶部渐变光晕 */}
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
				<div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />

				{/* 底部渐变光晕 */}
				<div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/3 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl" />

				{/* 网格图案 */}
				<div
					className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
					style={{
						backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `,
						backgroundSize: "50px 50px",
						backgroundPosition: "0 0, 0 0",
					}}
				/>

				{/* 几何形状 */}
				<div className="absolute top-20 left-10 w-32 h-32 border border-blue-500/10 dark:border-blue-500/20 rounded-full opacity-50" />
				<div className="absolute top-40 right-20 w-24 h-24 border border-indigo-500/10 dark:border-indigo-500/20 rounded-lg rotate-12 opacity-50" />
				<div className="absolute bottom-40 left-20 w-40 h-40 border border-purple-500/10 dark:border-purple-500/20 rounded-full opacity-50" />
				<div className="absolute bottom-20 right-10 w-20 h-20 border border-violet-500/10 dark:border-violet-500/20 rounded-lg opacity-50" />
			</div>

			{/* 内容层 */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-4">
				{children}
			</div>
		</div>
	);
}
