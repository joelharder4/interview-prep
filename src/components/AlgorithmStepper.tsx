import { useEffect, useMemo, useState } from 'react'
import type { AlgorithmCard, AlgorithmFrame } from '../data/algorithms'

type AlgorithmStepperProps = {
    algorithm: AlgorithmCard
}

const PLAY_INTERVAL_MS = 1100

export function AlgorithmStepper({ algorithm }: AlgorithmStepperProps) {
    const [frameIndex, setFrameIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const totalFrames = algorithm.frames.length
    const frame = algorithm.frames[frameIndex]
    const isComplete = frameIndex === totalFrames - 1
    const viewportMinHeightClass =
        frame.kind === 'graph' || frame.kind === 'points' ? 'min-h-[232px]' : 'min-h-0'

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const id = window.setInterval(() => {
            setFrameIndex((current) => {
                if (current >= totalFrames - 1) {
                    window.clearInterval(id)
                    setIsPlaying(false)
                    return current
                }
                return current + 1
            })
        }, PLAY_INTERVAL_MS)

        return () => {
            window.clearInterval(id)
        }
    }, [isPlaying, totalFrames])

    const progressLabel = useMemo(
        () => `Step ${frameIndex + 1} / ${totalFrames}`,
        [frameIndex, totalFrames],
    )

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <ControlButton
                    label="Start"
                    onClick={() => {
                        setFrameIndex(0)
                        setIsPlaying(false)
                    }}
                    disabled={frameIndex === 0}
                />
                <ControlButton
                    label="Back"
                    onClick={() => {
                        setFrameIndex((current) => Math.max(0, current - 1))
                        setIsPlaying(false)
                    }}
                    disabled={frameIndex === 0}
                />
                <ControlButton
                    label={isPlaying ? 'Pause' : 'Play'}
                    onClick={() => {
                        if (frameIndex >= totalFrames - 1 && !isPlaying) {
                            setFrameIndex(0)
                        }
                        setIsPlaying((current) => !current)
                    }}
                    disabled={totalFrames <= 1}
                />
                <ControlButton
                    label="Forward"
                    onClick={() => {
                        setFrameIndex((current) => Math.min(totalFrames - 1, current + 1))
                        setIsPlaying(false)
                    }}
                    disabled={frameIndex >= totalFrames - 1}
                />
                <ControlButton
                    label="End"
                    onClick={() => {
                        setFrameIndex(totalFrames - 1)
                        setIsPlaying(false)
                    }}
                    disabled={frameIndex >= totalFrames - 1}
                />
                <span className="ml-auto rounded-full bg-[var(--surface)] px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    {progressLabel}
                </span>
            </div>

            <div className={`${viewportMinHeightClass} rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3`}>
                <Visualizer frame={frame} isComplete={isComplete} />
            </div>

            <p className="text-[0.86rem] leading-6 text-[var(--muted)]">{frame.note}</p>
        </div>
    )
}

type ControlButtonProps = {
    label: string
    onClick: () => void
    disabled?: boolean
}

function ControlButton({ label, onClick, disabled = false }: ControlButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="soft-focus inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {label}
        </button>
    )
}

function Visualizer({ frame, isComplete }: { frame: AlgorithmFrame; isComplete: boolean }) {
    if (frame.kind === 'array') {
        return <ArrayVisualization frame={frame} />
    }
    if (frame.kind === 'graph') {
        return <GraphVisualization frame={frame} isComplete={isComplete} />
    }
    if (frame.kind === 'tree') {
        return <TreeVisualization frame={frame} isComplete={isComplete} />
    }
    return <PointsVisualization frame={frame} isComplete={isComplete} />
}

function ArrayVisualization({
    frame,
}: {
    frame: Extract<AlgorithmFrame, { kind: 'array' }>
}) {
    const columnTemplate = `repeat(${frame.values.length}, minmax(2.4rem, 1fr))`

    const groupToneClass = (tone?: 'cool' | 'warm' | 'neutral') => {
        if (tone === 'cool') {
            return 'bg-[#dbeafe] text-[#1d4ed8] border-[#93c5fd]'
        }
        if (tone === 'warm') {
            return 'bg-[#fff1d6] text-[#92400e] border-[#f4b76a]'
        }
        return 'bg-[#e5e7eb] text-[#334155] border-[#cbd5e1]'
    }

    return (
        <div className="space-y-3">
            {frame.windowLabel ? (
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    {frame.windowLabel}
                </p>
            ) : null}

            <div className="grid gap-2" style={{ gridTemplateColumns: columnTemplate }}>
                {frame.values.map((_, idx) => (
                    <div key={`index-${idx}`} className="text-center font-mono text-[0.64rem] text-[var(--muted)]">
                        {idx}
                    </div>
                ))}
            </div>

            <div className="grid gap-2" style={{ gridTemplateColumns: columnTemplate }}>
                {frame.values.map((value, idx) => {
                    const isActive = frame.activeIndices?.includes(idx)
                    const isRemoved = frame.removedIndices?.includes(idx)
                    const isDone = frame.doneIndices?.includes(idx)

                    const color = isDone
                        ? 'bg-[#d7f0e5] border-[#9ecfb8] text-[#1e5b49]'
                        : isRemoved
                            ? 'bg-[#fff1d6] border-[#f4b76a] text-[#92400e]'
                        : isActive
                            ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1d4ed8]'
                            : 'bg-[#f3f4f6] border-[#d1d5db] text-[#374151]'

                    return (
                        <div
                            key={`${idx}-${value}`}
                            className={`rounded-lg border px-2 py-2 text-center font-mono text-[0.8rem] ${color}`}
                        >
                            {value}
                        </div>
                    )
                })}
            </div>

            {frame.arrayGroups?.length ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: columnTemplate }}>
                    {frame.arrayGroups.map((group) => (
                        <div
                            key={`${group.label}-${group.start}-${group.end}`}
                            className={`rounded-md border px-2 py-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.06em] ${groupToneClass(group.tone)}`}
                            style={{ gridColumn: `${group.start + 1} / ${group.end + 2}` }}
                        >
                            {group.label}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

function GraphVisualization({
    frame,
    isComplete,
}: {
    frame: Extract<AlgorithmFrame, { kind: 'graph' }>
    isComplete: boolean
}) {
    const centerX = 150
    const centerY = 94
    const radius = 70

    const coords = frame.nodes.reduce<Record<string, { x: number; y: number }>>((acc, node, idx) => {
        const angle = (2 * Math.PI * idx) / frame.nodes.length - Math.PI / 2
        acc[node] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        }
        return acc
    }, {})

    return (
        <div className="space-y-3">
            <svg viewBox="0 0 300 200" className="h-[190px] w-full rounded-lg bg-[#f9fafb]">
                {frame.edges.map(([from, to]) => {
                    const p1 = coords[from]
                    const p2 = coords[to]
                    return (
                        <line
                            key={`${from}-${to}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#94a3b8"
                            strokeWidth="2"
                        />
                    )
                })}

                {frame.weightedEdges?.map(([from, to, weight]) => {
                    const p1 = coords[from]
                    const p2 = coords[to]
                    const midX = (p1.x + p2.x) / 2
                    const midY = (p1.y + p2.y) / 2

                    return (
                        <g key={`weight-${from}-${to}`}>
                            <rect
                                x={midX - 8.5}
                                y={midY - 7}
                                width="17"
                                height="14"
                                rx="3"
                                fill="#fff7e6"
                                stroke="#f2c98a"
                                strokeWidth="1"
                            />
                            <text
                                x={midX}
                                y={midY + 3}
                                textAnchor="middle"
                                fontSize="8.5"
                                fill="#7a4a11"
                                fontWeight="700"
                            >
                                {weight}
                            </text>
                        </g>
                    )
                })}

                {frame.nodes.map((node) => {
                    const point = coords[node]
                    const isVisited = frame.visited.includes(node)
                    const isFrontier = frame.frontier.includes(node)
                    const isCurrent = frame.current === node

                    const fill = isComplete
                        ? '#34d399'
                        : isCurrent
                        ? '#f59e0b'
                        : isFrontier
                            ? '#93c5fd'
                            : isVisited
                                ? '#34d399'
                                : '#e5e7eb'

                    return (
                        <g key={node}>
                            <circle cx={point.x} cy={point.y} r="14" fill={fill} stroke="#475569" strokeWidth="1.5" />
                            <text
                                x={point.x}
                                y={point.y + 4}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#0f172a"
                                fontWeight="700"
                            >
                                {node}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                Frontier: {frame.frontier.join(' -> ') || 'empty'}
            </p>
            {frame.startNode && frame.goalNode ? (
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    Start: {frame.startNode} | Goal: {frame.goalNode}
                </p>
            ) : null}
            {frame.routeHint ? (
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    {frame.routeHint}
                </p>
            ) : null}
        </div>
    )
}

function TreeVisualization({
    frame,
    isComplete,
}: {
    frame: Extract<AlgorithmFrame, { kind: 'tree' }>
    isComplete: boolean
}) {
    const width = 300
    const rootY = 28
    const levelGap = 56

    const positions = frame.levels.reduce<Record<string, { x: number; y: number }>>((acc, level, levelIndex) => {
        const denominator = level.length + 1
        level.forEach((node, nodeIndex) => {
            acc[node] = {
                x: (width * (nodeIndex + 1)) / denominator,
                y: rootY + levelIndex * levelGap,
            }
        })
        return acc
    }, {})

    const edges: Array<{ from: string; to: string }> = []
    for (let levelIndex = 0; levelIndex < frame.levels.length - 1; levelIndex += 1) {
        const level = frame.levels[levelIndex]
        const childLevel = frame.levels[levelIndex + 1]

        level.forEach((parent, parentIndex) => {
            const leftChild = childLevel[parentIndex * 2]
            const rightChild = childLevel[parentIndex * 2 + 1]

            if (leftChild) {
                edges.push({ from: parent, to: leftChild })
            }
            if (rightChild) {
                edges.push({ from: parent, to: rightChild })
            }
        })
    }

    const visitedSet = new Set(frame.traversal)

    return (
        <div className="space-y-3">
            <svg viewBox="0 0 300 176" className="h-[176px] w-full rounded-lg bg-[#f9fafb]">
                {edges.map((edge) => {
                    const p1 = positions[edge.from]
                    const p2 = positions[edge.to]
                    return (
                        <line
                            key={`${edge.from}-${edge.to}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#94a3b8"
                            strokeWidth="2"
                        />
                    )
                })}

                {Object.entries(positions).map(([node, point]) => {
                    const isCurrent = frame.current === node
                    const isVisited = visitedSet.has(node)

                    const fill = isComplete
                        ? '#34d399'
                        : isCurrent
                            ? '#f59e0b'
                            : isVisited
                                ? '#34d399'
                                : '#cbd5e1'

                    const textColor = isCurrent ? '#7c2d12' : '#0f172a'

                    return (
                        <g key={node}>
                            <circle cx={point.x} cy={point.y} r="10.8" fill={fill} stroke="#64748b" strokeWidth="1.2" />
                            <text x={point.x} y={point.y + 3.4} textAnchor="middle" fontSize="10" fill={textColor}>
                                {node}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                Traversal output: {frame.traversal.join(' -> ') || 'pending'}
            </p>
        </div>
    )
}

function PointsVisualization({
    frame,
    isComplete,
}: {
    frame: Extract<AlgorithmFrame, { kind: 'points' }>
    isComplete: boolean
}) {
    const lookup = frame.points.reduce<Record<string, { x: number; y: number }>>((acc, point) => {
        acc[point.label] = point
        return acc
    }, {})

    const hullPath = frame.hull.map((label) => lookup[label]).filter(Boolean)

    return (
        <svg viewBox="0 0 260 130" className="h-[210px] w-full rounded-lg bg-[#f9fafb]">
            {hullPath.length >= 2 ? (
                <polygon
                    points={hullPath.map((point) => `${point.x},${point.y}`).join(' ')}
                    fill="rgba(96, 165, 250, 0.18)"
                    stroke="#1d4ed8"
                    strokeWidth="2"
                />
            ) : null}

            {frame.points.map((point) => {
                const onHull = frame.hull.includes(point.label)
                const isCurrent = frame.current === point.label
                const fill = isComplete ? '#34d399' : isCurrent ? '#f59e0b' : onHull ? '#2563eb' : '#94a3b8'
                return (
                    <g key={point.label}>
                        <circle cx={point.x} cy={point.y} r="4.8" fill={fill} />
                        <text x={point.x + 6} y={point.y - 6} fontSize="9" fill="#0f172a">
                            {point.label}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}
