import os
from PIL import Image, ImageDraw, ImageFont

def generate_preview_gif():
    width = 960
    height = 540
    frames = []

    stages = [
        {
            "num": "01",
            "title": "DISCOVER",
            "sub": "Playwright Headless Chromium + axe-core 4.10.2",
            "badge": "Target: https://store.demo.internal/checkout",
            "status": "SWEEPING DOM",
            "stat1": "DOM Nodes Evaluated: 1,420",
            "stat2": "Evaluated Rules: 52 Rules Mapped to WCAG 2.2 AA",
            "stat3": "Scan Latency: 0.94s Execution Time",
            "highlight": "axe-core injection active • SSRF private network isolation verified",
            "color": (99, 102, 241),  # indigo
        },
        {
            "num": "02",
            "title": "INSPECT",
            "sub": "Computed Contrast Mathematics & DOM Selector Evidence",
            "badge": "Finding ID: finding-contrast-01 • WCAG 1.4.3 Contrast (Minimum)",
            "status": "CRITICAL SEVERITY",
            "stat1": "Selector: main > form > div.actions > button.cta-primary",
            "stat2": "Computed Ratio: 2.92:1 (FAIL) — Below 4.50:1 AA Threshold",
            "stat3": "Color Luminance: Foreground #94a3b8 on Background #0f172a",
            "highlight": "Zero False-Positive Target • Computed against rendered DOM snapshot",
            "color": (239, 68, 68),  # red
        },
        {
            "num": "03",
            "title": "REMEDIATE",
            "sub": "Actionable Code-Level Before / After Remediation Diff",
            "badge": "File: src/components/CheckoutButton.tsx",
            "status": "PATCH GENERATED",
            "stat1": "- <button className=\"bg-slate-900 text-slate-400 font-medium\">",
            "stat2": "+ <button className=\"bg-indigo-600 text-white font-semibold\" aria-label=\"Complete purchase\">",
            "stat3": "  Remediation: Upgrade foreground/background tokens to exceed 4.5:1",
            "highlight": "Calculated Contrast Upgraded from 2.92:1 to 8.24:1 (Passed AA & AAA)",
            "color": (168, 85, 247),  # violet
        },
        {
            "num": "04",
            "title": "VERIFY",
            "sub": "Deterministic Baseline Comparison & Fix Verification",
            "badge": "Comparator: SHA-256 Fingerprint Matching Engine",
            "status": "VERIFIED FIXED",
            "stat1": "Baseline Findings: 7 Open Violations Detected",
            "stat2": "Active Audit Findings: 0 Open Violations",
            "stat3": "Net Regressions: 0 New Violations Introduced",
            "highlight": "Deterministic Fingerprint Match • Confirmed Resolution in DOM Rescan",
            "color": (16, 185, 129),  # emerald
        },
        {
            "num": "05",
            "title": "REPORT",
            "sub": "Executive Compliance Scorecard & Machine-Readable Export",
            "badge": "Audit Report #104 • Target: Checkout Flow",
            "status": "READY FOR EXPORT",
            "stat1": "Level A Conformance: 100% (28/28 Passed)",
            "stat2": "Level AA Conformance: 100% (20/20 Passed)",
            "stat3": "Export Formats: Printable PDF • Machine-Readable JSON • VPAT/ACR",
            "highlight": "Auditor & Legal Conformance Notice • Stakeholder Ready Summary",
            "color": (14, 165, 233),  # sky
        },
    ]

    for idx, stage in enumerate(stages):
        # 16 frames per stage @ 85ms = 1.36s per stage
        for _ in range(16):
            img = Image.new("RGB", (width, height), color=(7, 9, 14))
            draw = ImageDraw.Draw(img)

            # Outer border
            draw.rectangle([10, 10, width - 10, height - 10], outline=(30, 41, 59), width=2)

            # Window Header bar
            draw.rectangle([10, 10, width - 10, 50], fill=(15, 23, 42))
            draw.line([10, 50, width - 10, 50], fill=(30, 41, 59), width=1)

            # Window buttons (macOS style dots)
            draw.ellipse([26, 25, 38, 37], fill=(239, 68, 68))
            draw.ellipse([46, 25, 58, 37], fill=(245, 158, 11))
            draw.ellipse([66, 25, 78, 37], fill=(16, 185, 129))

            # Header text
            draw.text((95, 22), "Inklara Inclusive Engineering Platform — Continuous Verification Workflow", fill=(226, 232, 240))
            draw.text((width - 180, 22), "WCAG 2.2 Level AA", fill=(129, 140, 248))

            # Progress bar across 5 stages
            bar_y = 65
            step_w = (width - 40) / 5
            for s_idx in range(5):
                x1 = 20 + s_idx * step_w
                x2 = x1 + step_w - 8
                fill_c = (99, 102, 241) if s_idx <= idx else (30, 41, 59)
                draw.rectangle([x1, bar_y, x2, bar_y + 4], fill=fill_c)
                s_name = ["Discover", "Inspect", "Remediate", "Verify", "Report"][s_idx]
                txt_c = (255, 255, 255) if s_idx == idx else (100, 116, 139)
                draw.text((x1, bar_y + 8), f"0{s_idx + 1}. {s_name}", fill=txt_c)

            # Content container
            content_y = 105
            draw.rectangle([20, content_y, width - 20, height - 25], fill=(11, 15, 25), outline=(30, 41, 59), width=1)

            # Stage Pill
            badge_color = stage["color"]
            draw.rectangle(
                [40, content_y + 20, 200, content_y + 48],
                fill=(badge_color[0] // 5, badge_color[1] // 5, badge_color[2] // 5),
                outline=badge_color,
                width=1,
            )
            draw.text((50, content_y + 26), f"STAGE {stage['num']}: {stage['title']}", fill=(255, 255, 255))

            # Status pill
            draw.text((220, content_y + 26), f"● {stage['status']}", fill=badge_color)

            # Stage Subtitle & Target Badge
            draw.text((40, content_y + 60), stage["sub"], fill=(241, 245, 249))
            draw.text((40, content_y + 85), stage["badge"], fill=(148, 163, 184))

            # Inner Card with technical details
            card_y = content_y + 115
            draw.rectangle([40, card_y, width - 40, card_y + 195], fill=(15, 23, 42), outline=(30, 41, 59), width=1)

            # Stats lines
            draw.text((60, card_y + 20), stage["stat1"], fill=(226, 232, 240))
            draw.text(
                (60, card_y + 55),
                stage["stat2"],
                fill=badge_color if "FAIL" in stage["stat2"] or "New" in stage["stat2"] else (226, 232, 240),
            )
            draw.text((60, card_y + 90), stage["stat3"], fill=(226, 232, 240))

            # Highlight Box
            hl_y = card_y + 130
            draw.rectangle(
                [60, hl_y, width - 60, hl_y + 45],
                fill=(badge_color[0] // 6, badge_color[1] // 6, badge_color[2] // 6),
                outline=(badge_color[0] // 2, badge_color[1] // 2, badge_color[2] // 2),
                width=1,
            )
            draw.text((75, hl_y + 14), f"✓  {stage['highlight']}", fill=(255, 255, 255))

            # Footer inside preview
            draw.text(
                (40, height - 50),
                "Inklara Verification Engine • Headless Playwright Chromium • axe-core 4.10.2 • WCAG 2.2 Level AA",
                fill=(100, 116, 139),
            )

            frames.append(img)

    out_dir = os.path.join("public", "brand")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "inklara-workflow-preview.gif")

    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=85,
        loop=0,
        optimize=True,
    )
    print(f"Generated GIF successfully at {out_path} ({len(frames)} frames, {os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_preview_gif()
