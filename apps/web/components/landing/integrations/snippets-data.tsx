import React from "react";
import { IconBrandNextjs, IconCode, IconWorld, IconLink } from "@tabler/icons-react";
import type { CodeEditorTab } from "~/components/common/code-editor-window";

export const EMBED_CODE_SNIPPETS = {
  nextjs: `// Next.js & React Native Responsive Component
import { ChaiFormEmbed } from "@chaiform/react";

export default function LeadCapturePage() {
  return (
    <ChaiFormEmbed
      formId="product_feedback_v2"
      theme="stealth-dark"
      onComplete={(response) => console.log("Received:", response)}
      className="w-full min-h-[540px] rounded-2xl"
    />
  );
}`,
  iframe: `<!-- Universal Responsive 1-Line Embed -->
<iframe
  src="https://chaiform.com/embed/product_feedback_v2?theme=dark"
  width="100%"
  height="580px"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);"
></iframe>`,
  webflow: `<!-- Webflow & Framer Custom Code Block -->
<div id="chaiform-container" data-form="product_feedback_v2"></div>
<script src="https://cdn.chaiform.com/v2/embed.min.js" async></script>`,
  url: `https://chaiform.com/flow/product_feedback_v2`,
};

export const EMBED_TABS_CONFIG: CodeEditorTab[] = [
  {
    id: "nextjs",
    label: "Next.js / React",
    fileName: "LeadCapturePage.tsx",
    language: "TypeScript React",
    icon: IconBrandNextjs,
    iconColor: "text-sky-400",
    rawCode: EMBED_CODE_SNIPPETS.nextjs,
    renderedLines: [
      <span key="1">
        <span className="text-zinc-500 italic">
          // Next.js &amp; React Native Responsive Component
        </span>
      </span>,
      <span key="2">
        <span className="text-fuchsia-400 font-medium">import</span>{" "}
        <span className="text-zinc-400">{"{ "}</span>
        <span className="text-yellow-300 font-medium">ChaiFormEmbed</span>
        <span className="text-zinc-400">{" }"}</span>{" "}
        <span className="text-fuchsia-400 font-medium">from</span>{" "}
        <span className="text-emerald-400">"@chaiform/react"</span>
        <span className="text-zinc-400">;</span>
      </span>,
      <span key="3"> </span>,
      <span key="4">
        <span className="text-fuchsia-400 font-medium">export default function</span>{" "}
        <span className="text-blue-400 font-semibold">LeadCapturePage</span>
        <span className="text-zinc-300">() {"{"}</span>
      </span>,
      <span key="5">
        {"  "}
        <span className="text-fuchsia-400 font-medium">return</span>{" "}
        <span className="text-zinc-300">(</span>
      </span>,
      <span key="6">
        {"    "}
        <span className="text-sky-400">&lt;</span>
        <span className="text-yellow-300 font-medium">ChaiFormEmbed</span>
      </span>,
      <span key="7">
        {"      "}
        <span className="text-lime-400">formId</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"product_feedback_v2"</span>
      </span>,
      <span key="8">
        {"      "}
        <span className="text-lime-400">theme</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"stealth-dark"</span>
      </span>,
      <span key="9">
        {"      "}
        <span className="text-lime-400">onComplete</span>
        <span className="text-zinc-400">=</span>
        <span className="text-zinc-300">{"{("}</span>
        <span className="text-amber-300">response</span>
        <span className="text-zinc-300">{") => "}</span>
        <span className="text-blue-400">console</span>
        <span className="text-zinc-400">.</span>
        <span className="text-yellow-300">log</span>
        <span className="text-zinc-300">(</span>
        <span className="text-emerald-400">"Received:"</span>
        <span className="text-zinc-300">, </span>
        <span className="text-amber-300">response</span>
        <span className="text-zinc-300">){"}"}</span>
      </span>,
      <span key="10">
        {"      "}
        <span className="text-lime-400">className</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"w-full min-h-[540px] rounded-2xl"</span>
      </span>,
      <span key="11">
        {"    "}
        <span className="text-sky-400">/&gt;</span>
      </span>,
      <span key="12">
        {"  "}
        <span className="text-zinc-300">);</span>
      </span>,
      <span key="13">
        <span className="text-zinc-300">{"}"}</span>
      </span>,
    ],
  },
  {
    id: "iframe",
    label: "HTML <iframe>",
    fileName: "embed.html",
    language: "HTML5",
    icon: IconCode,
    iconColor: "text-amber-400",
    rawCode: EMBED_CODE_SNIPPETS.iframe,
    renderedLines: [
      <span key="1">
        <span className="text-zinc-500 italic">
          &lt;!-- Universal Responsive 1-Line Embed --&gt;
        </span>
      </span>,
      <span key="2">
        <span className="text-sky-400">&lt;</span>
        <span className="text-rose-400 font-medium">iframe</span>
      </span>,
      <span key="3">
        {"  "}
        <span className="text-lime-400">src</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">
          "https://chaiform.com/embed/product_feedback_v2?theme=dark"
        </span>
      </span>,
      <span key="4">
        {"  "}
        <span className="text-lime-400">width</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"100%"</span>
      </span>,
      <span key="5">
        {"  "}
        <span className="text-lime-400">height</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"580px"</span>
      </span>,
      <span key="6">
        {"  "}
        <span className="text-lime-400">frameborder</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"0"</span>
      </span>,
      <span key="7">
        {"  "}
        <span className="text-lime-400">allow</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"clipboard-write"</span>
      </span>,
      <span key="8">
        {"  "}
        <span className="text-lime-400">style</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">
          "border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);"
        </span>
      </span>,
      <span key="9">
        <span className="text-sky-400">&gt;&lt;/</span>
        <span className="text-rose-400 font-medium">iframe</span>
        <span className="text-sky-400">&gt;</span>
      </span>,
    ],
  },
  {
    id: "webflow",
    label: "Webflow / Framer",
    fileName: "webflow-snippet.html",
    language: "HTML5 Script",
    icon: IconWorld,
    iconColor: "text-purple-400",
    rawCode: EMBED_CODE_SNIPPETS.webflow,
    renderedLines: [
      <span key="1">
        <span className="text-zinc-500 italic">
          &lt;!-- Webflow &amp; Framer Custom Code Block --&gt;
        </span>
      </span>,
      <span key="2">
        <span className="text-sky-400">&lt;</span>
        <span className="text-rose-400 font-medium">div</span>{" "}
        <span className="text-lime-400">id</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"chaiform-container"</span>{" "}
        <span className="text-lime-400">data-form</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"product_feedback_v2"</span>
        <span className="text-sky-400">&gt;&lt;/</span>
        <span className="text-rose-400 font-medium">div</span>
        <span className="text-sky-400">&gt;</span>
      </span>,
      <span key="3">
        <span className="text-sky-400">&lt;</span>
        <span className="text-rose-400 font-medium">script</span>{" "}
        <span className="text-lime-400">src</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-400">"https://cdn.chaiform.com/v2/embed.min.js"</span>{" "}
        <span className="text-lime-400">async</span>
        <span className="text-sky-400">&gt;&lt;/</span>
        <span className="text-rose-400 font-medium">script</span>
        <span className="text-sky-400">&gt;</span>
      </span>,
    ],
  },
  {
    id: "url",
    label: "Direct URL",
    fileName: "endpoint.url",
    language: "Direct URI",
    icon: IconLink,
    iconColor: "text-lime-400",
    rawCode: EMBED_CODE_SNIPPETS.url,
    renderedLines: [
      <span key="1">
        <span className="text-zinc-500 italic">// Direct Shareable Respondent Endpoint</span>
      </span>,
      <span key="2">
        <span className="text-fuchsia-400 font-semibold">https</span>
        <span className="text-zinc-400">://</span>
        <span className="text-emerald-400 font-medium">chaiform.com</span>
        <span className="text-zinc-400">/</span>
        <span className="text-yellow-300 font-medium">flow</span>
        <span className="text-zinc-400">/</span>
        <span className="text-cyan-300 font-bold">product_feedback_v2</span>
      </span>,
    ],
  },
];
