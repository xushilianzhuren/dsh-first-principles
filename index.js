/**
 * dsh-first-principles · 第一性原理追问引擎（Host插件·零依赖）
 * 与 frame-kit（槽序输出格式）互补：本插件管"想"的纪律——四阶问、费曼判据、三红线、回声门。
 * 工具: fp_check(对一段推演做红线/费曼/回声词面体检)。
 */
export const name = 'first-principles'
export const inject = ['systemPrompt', 'tools']
const SECTION = 'first-principles:rules'
const DEFAULTS = { order: 90, enabled: true, tool: true }

function norm(c) { const r = c ?? {}; return { order: typeof r.order === 'number' ? r.order : DEFAULTS.order, enabled: r.enabled !== false, tool: r.tool !== false } }

function renderSection() {
  return [
    '## 第一性原理 · 追问纪律（推演/方案/重要判断时生效）',
    '',
    '**四阶问（新能力/新方案先过）**：能不能算法化？→能不能脚本化（不依赖本会话在线）？→能不能模型化？→能不能自我复制化？——到哪阶落哪阶，答不出=还没想透。',
    '**费曼判据**：任何术语/结论必须能翻译成一句人话——翻译不出=自己没懂，回炉重推。',
    '**三红线**：①禁引权威代推导（"某某说过"不是论证）②禁通用套话当结论（删掉后任何人都能补上的句子=删）③零件必答四阶问。',
    '**回声门**：重要长输出交前自问——与刚说过的话4词以上重复率高不高？>25%=换角度重写，>40%=硬循环，强制换切入（反方/极端假设/第一性重推）。',
    '**收尾义务**：答毕自问"本轮有没有可结晶的规律"——有就落盘，没有才算完。',
  ].join('\n')
}

const Cliche = [/^总之/, /^综上所述/, /值得我们深思/, /综上所述.{0,40}(展望|期待)/, /总而言之/, /相信在.{0,10}(努力|支持)/]
const EchoMarkers = [/正如.{0,12}所述/, /不可否认/, /众所周知/]

export default function plugin(ctx) {
  const cfg = norm(ctx.config?.[SECTION])
  if (!cfg.enabled) { ctx.logger?.info?.('dsh-first-principles: disabled'); return }
  ctx.registerSection?.({ name: SECTION, order: cfg.order, render: () => renderSection() })
  if (!cfg.tool) return
  ctx.registerTool?.({
    name: 'fp_check',
    description: '对一段推演/方案文本做词面体检：三红线（权威代推导/通用套话/缺四阶问）+回声词标记。给 PASS/黄标/拦截。',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string', description: '待检推演文本' } },
      required: ['text'],
      additionalProperties: false,
    },
    output: { schema: { type: 'object', properties: { report: { type: 'string' } }, required: ['report'], additionalProperties: false } },
    execute: async (args) => {
      try {
        const t = String(args?.text ?? '')
        if (t.trim().length < 30) return { report: '文本太短（<30字），无从体检。' }
        const lines = ['【第一性原理体检】']
        let flags = 0
        const authority = t.match(/(据报道|研究表明|专家(表示|认为)|古人云|据说)[:：，]?/g)
        if (authority && authority.length >= 2) { flags++; lines.push(`  🔴 权威代推导×${authority.length}：引用处改成自己的推导链条`); }
        const cliche = Cliche.filter(r => r.test(t))
        if (cliche.length) { flags++; lines.push(`  🔴 通用套话×${cliche.length}：删掉后谁都能补的话=删`); }
        const has4 = /(算法化|脚本化|模型化|复制化)/.test(t)
        const isProposal = /(方案|实现|做法|设计|架构)/.test(t)
        if (isProposal && !has4) { flags++; lines.push('  🟡 方案类文本未见四阶问（算法化→脚本化→模型化→复制化）——补答再出手'); }
        const echo = EchoMarkers.filter(r => r.test(t))
        if (echo.length) { flags++; lines.push(`  🟡 回声词×${echo.length}（如"众所周知/不可否认"）：填腔调句，换成实质内容`); }
        const fatman = /(翻译成人话|一句话说|通俗)/.test(t)
        if (!fatman && t.length > 600) lines.push('  ⚪ 提示：长推演未见费曼自译——结论段补一句人话翻译')
        lines.push(flags === 0 ? '  ✅ PASS（词面层）' : `  判定：${flags >= 2 ? '拦截·重写' : '黄标·修补'}`)
        lines.push('（词面体检抓不到"论证是否真成立"——判断力仍是你的）')
        return { report: lines.join('\n') }
      } catch (error) {
        return { report: 'first-principles 内部错：' + String(error?.message ?? error).slice(0, 160) }
      }
    },
  })
  ctx.logger?.info?.('dsh-first-principles: registered (order=%d)', cfg.order)
}
