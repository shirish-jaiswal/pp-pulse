"use client";

const COLORS = {
    TABLE_FELT: "radial-gradient(circle at center, #1a472a 0%, #07190d 100%)",
    ZERO: "#008d36",
    RED: "#d62828",
    BLACK: "#1a1a1a",
    GOLD: "#f9d423",
    CHIP_WIN: "#ffd700",
    BORDER: "#c5a059",
};

const REDS = [
    1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36,
];

const getChipPlacement = (code: string) => {
    const parts = code
        .split("-")
        .filter((p) => !isNaN(Number(p)))
        .map(Number);

    const getSingleCoord = (n: number) => {
        if (n === 0) return { x: 0.6, y: 1.5 };
        const col = Math.ceil(n / 3);
        const row = 3 - (n % 3 || 3) + 0.5;
        return { x: col + 0.6, y: row };
    };

    if (parts.length > 0) {
        const coords = parts.map(getSingleCoord);
        const avgX = coords.reduce((s, p) => s + p.x, 0) / coords.length;
        const avgY = coords.reduce((s, p) => s + p.y, 0) / coords.length;
        return {
            left: `${(avgX / 14.5) * 100}%`,
            top: `${(avgY / 5.5) * 100}%`,
        };
    }

    const outsideMap: Record<string, [number, number]> = {
        "dozen-1": [2.6, 3.8],
        "dozen-2": [6.6, 3.8],
        "dozen-3": [10.6, 3.8],
        "col-1": [13.6, 0.5],
        "col-2": [13.6, 1.5],
        "col-3": [13.6, 2.5],
        low: [1.6, 4.8],
        even: [3.6, 4.8],
        red: [5.6, 4.8],
        black: [7.6, 4.8],
        odd: [9.6, 4.8],
        high: [11.6, 4.8],
    };

    const pos = outsideMap[code.toLowerCase()] || [0, 0];
    return {
        left: `${(pos[0] / 14.5) * 100}%`,
        top: `${(pos[1] / 5.5) * 100}%`,
    };
};

const getWinStatus = (code: string, winNum: number) => {
    const parts = code
        .split("-")
        .filter((p) => !isNaN(Number(p)))
        .map(Number);

    if (parts.length > 0) {
        const isWin = parts.includes(winNum);
        return { isWin };
    }

    if (winNum === 0) return { isWin: false };

    let isWin = false;

    switch (code.toLowerCase()) {
        case "red":
            isWin = REDS.includes(winNum);
            break;
        case "black":
            isWin = !REDS.includes(winNum);
            break;
        case "even":
            isWin = winNum % 2 === 0;
            break;
        case "odd":
            isWin = winNum % 2 !== 0;
            break;
        case "low":
            isWin = winNum <= 18;
            break;
        case "high":
            isWin = winNum >= 19;
            break;
        case "dozen-1":
            isWin = winNum <= 12;
            break;
        case "dozen-2":
            isWin = winNum > 12 && winNum <= 24;
            break;
        case "dozen-3":
            isWin = winNum > 24;
            break;
        case "col-1":
            isWin = winNum % 3 === 0;
            break;
        case "col-2":
            isWin = winNum % 3 === 2;
            break;
        case "col-3":
            isWin = winNum % 3 === 1;
            break;
    }

    return { isWin };
};

export const ProfessionalRoulette = ({
    winningNumber,
    bets,
    totalWinAmount,
}: {
    winningNumber: number;
    bets: Record<string, number>;
    totalWinAmount: number;
}) => {
    const rows = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    ];

    return (
        <div
            className="w-full p-2 rounded-3xl shadow-md border-8 border-red-950 select-none"
            style={{ background: COLORS.TABLE_FELT }}
        >
            {/* Header Info */}
            <div className="flex justify-between items-end mb-2 px-2">
                <div className="flex items-center gap-3">
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black border-3 border-white/20 shadow-2xl"
                        style={{
                            background:
                                winningNumber === 0
                                    ? COLORS.ZERO
                                    : REDS.includes(winningNumber)
                                        ? COLORS.RED
                                        : COLORS.BLACK,
                            color: "white",
                        }}
                    >
                        {winningNumber}
                    </div>

                    <div>
                        <div className="text-white/40 uppercase text-sm font-bold tracking-[0.3em]">
                            Result
                        </div>
                        <div
                            className="text-4xl font-serif italic"
                            style={{ color: COLORS.GOLD }}
                        >
                            {winningNumber === 0
                                ? "Zero"
                                : REDS.includes(winningNumber)
                                    ? "Rouge"
                                    : "Noir"}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-white/40 uppercase text-sm font-bold tracking-widest">
                        Total Win
                    </div>
                    <div
                        className={`text-4xl font-black ${totalWinAmount > 0 ? "text-yellow-400" : "text-red-400"
                            }`}
                    >
                        ${totalWinAmount.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="relative w-full aspect-[36/9] border-4 border-white/30 rounded-xl overflow-hidden shadow-inner bg-black/20">
                {/* Numbers Grid */}
                <div className="flex h-[60%]">
                    <div
                        className="w-[8%] flex items-center justify-center text-5xl font-black border-r-4 border-white/30"
                        style={{ backgroundColor: COLORS.ZERO, color: "white" }}
                    >
                        0
                    </div>
                    <div className="flex-1 flex flex-col">
                        {rows.map((row, i) => (
                            <div
                                key={i}
                                className="flex flex-1 border-b-2 border-white/20 last:border-0"
                            >
                                {row.map((n) => (
                                    <div
                                        key={n}
                                        className="flex-1 flex items-center justify-center text-3xl font-black border-r-2 border-white/20"
                                        style={{
                                            background: REDS.includes(n)
                                                ? COLORS.RED
                                                : COLORS.BLACK,
                                            color: "white",
                                        }}
                                    >
                                        {n}
                                    </div>
                                ))}
                                <div className="w-[10%] flex items-center justify-center text-xl font-black bg-white/10 text-white">
                                    2:1
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dozens */}
                <div className="flex h-[20%] ml-[8%] mr-[8.3%] border-t-2 border-white/30">
                    {["1st 12", "2nd 12", "3rd 12"].map((d) => (
                        <div
                            key={d}
                            className="flex-1 flex items-center justify-center text-xl font-black text-white/70 border-r-2 border-white/20 uppercase tracking-widest"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Outside */}
                <div className="flex h-[20%] ml-[8%] mr-[8.3%] border-t-2 border-white/30">
                    {["1-18", "EVEN", "RED", "BLACK", "ODD", "19-36"].map(
                        (label) => (
                            <div
                                key={label}
                                className={`flex-1 flex items-center justify-center border-r-2 border-white/20
                ${label === "RED" ? "bg-[#d62828]" : ""}
                ${label === "BLACK" ? "bg-[#1a1a1a]" : ""}`}
                            >
                                <span className="text-lg font-black text-white">
                                    {label}
                                </span>
                            </div>
                        )
                    )}
                </div>

                {/* CHIP LAYER */}
                {Object.entries(bets).map(([code, amount]) => {
                    const { left, top } = getChipPlacement(code);
                    const { isWin } = getWinStatus(code, winningNumber);

                    return (
                        <div
                            key={code}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 ${isWin ? "z-50" : "opacity-30 grayscale-[0.3]"
                                }`}
                            style={{ left, top }}
                        >
                            <div
                                className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] rotate-12"
                                style={{
                                    background: isWin ? COLORS.CHIP_WIN : "#e5e7eb",
                                    borderColor: isWin ? "#b8860b" : "#9ca3af",
                                }}
                            >
                                <span className="text-sm font-black text-black">
                                    ${Number.isInteger(amount) ? amount : amount.toFixed(2)}
                                </span>
                            </div>

                            {isWin && totalWinAmount > 0 && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-yellow-400 px-3 py-1.5 rounded-xl border-2 border-yellow-400 font-black text-sm whitespace-nowrap shadow-2xl">
                                    +${(amount).toFixed(2)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};