# CivicConnect design

Approved visual direction: the revised standalone preview approved by Ryno. The Master Brief and existing application behavior remain authoritative for functionality. This document records UI choices only; it does not replace the PED or README.

Audience: community requesters, authorised service staff and scoped managers. English interface, South African date display in Africa/Johannesburg. Native date inputs use the user's local timezone and the existing API converts timestamps to UTC.

Palette: original green #17634f, ink #173b38, paper #f7f8f4, muted #576765 and border #d7dfd8. White panels and existing soft green #e9f1e6. Focus #ad6715 and error #9d2525 remain functional accents. Runtime source: src/app/globals.css.

Type: Bahnschrift display, Segoe UI body, system sans-serif fallbacks. Heading scale 40px workspace, up to 72px homepage, 33px mobile workspace. Utility labels use smaller body text.

Public homepage: clear single action, original green neighbourhood illustration with a brief request-path animation, three unnumbered process steps. Sign-in uses the same illustration. The illustration communicates a typical workflow and is not live request data.

Workspace: shared green sidebar, role-aware navigation, white account header without breadcrumbs, off-white canvas. Page headings: Your Workspace, New Request, Service Team and Manager Overview. No sidebar slogan or divider, preview notices, em dashes or CTA icons.

Lists: real scoped request counts and filters; tabular desktop presentation becomes cards on mobile. Keep latest-1,000-record caveat. In-progress count replaces the preview's staff assignment count because the current list API does not expose current assignments. No fabricated counts, identities or categories.

Details: issue, private attachment and metadata beside status history and authorised workflow actions. Preserve public/internal comment rules and terminal reopening semantics. Requesters cannot acquire staff comment permissions through this visual redesign.

Motion: short entrance transitions and one-time illustrated path. Respect prefers-reduced-motion; no continuous loops. Stable controls, visible focus, minimum control height 46px, native scrolling with stable gutter. Mobile breakpoint 760px.

Ownership and behavior are recorded in UX-CONTRACT.md. Reuse these shared owners for future screens.
