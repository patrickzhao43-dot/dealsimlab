/* =====================================================================
   SITE CONTENT: every word, deal figure, company profile and model
   default lives in this file.
   - Edit by hand, or open the site with ?edit, change text on the page,
     click "Export content.js" and replace this file.
   - Text in [square brackets] is placeholder: replace before sharing.
   - Money in US$ millions unless a field says otherwise.
   - kind: "disclosed" = from a filing or official release,
           "analysis"  = our interpretation,
           "assumption" = model input chosen by us.
   ===================================================================== */
window.SITE = {
  "settings": {
    "siteName": "DealSim Lab",
    "tagline": "Simulating the economics of software M&A",
    "email": "[team@dealsimlab.com]",
    "footerNote": "Student research project. Draft analysis, not investment advice."
  },

  "home": {
    "eyebrow": "Study 01 · AI Deal Lab",
    "title": "Why do software companies buy AI companies, and when does the deal pay for itself?",
    "lede": "DealSim Lab is a research workbench for software M&A. Each study takes a real transaction, separates what was disclosed from what we infer, and simulates the conditions under which the deal creates more value than it costs.",
    "status": "Status: first draft. The research memo, company profiles, model and this site are complete as a working draft. Independent verification against primary filings, outside feedback and ongoing updates are in progress and logged on the Log page.",
    "question": "Study 01 asks: why did HubSpot acquire Dashworks, and under what conditions does an AI-capability acquisition create value above its all-in cost?",
    "layers": [
      { "layer": "Industry & product", "question": "What problem does each AI company solve?", "where": "10 company profiles, grouped by capability", "route": "companies" },
      { "layer": "Deal logic", "question": "Why buy, rather than build or partner?", "where": "Dashworks main case, Frame AI comparison, research memo", "route": "research" },
      { "layer": "Financial return", "question": "What revenue, margin and synergy make the price worth paying?", "where": "Five-year cash-flow model, NPV, three scenarios, sensitivity", "route": "model" }
    ],
    "finding": "\"What did the acquisition cost?\" has no single answer. HubSpot's filings separate the purchase consideration, the net cash paid after cash acquired, and compensation tied to continued employment, which is expensed after closing rather than counted in the price. For Dashworks those are $18.2m, $17.8m and about $6.6m. Treating retention as part of the economic cost changes how the deal should be judged.",
    "method": [
      { "kind": "disclosed", "title": "Disclosed facts", "text": "Acquisition dates, purchase consideration, cash acquired, goodwill, acquired technology and post-combination compensation, taken from HubSpot's SEC filings and official announcements." },
      { "kind": "analysis", "title": "Analysis", "text": "Why the capabilities fit, how synergies could arise, and which factors could make the deal fail. These are our judgments and are labelled as such." },
      { "kind": "assumption", "title": "Model assumptions", "text": "Revenue growth, cash margin, synergy, avoided build cost and discount rate. Chosen by us, shown openly, and adjustable on the Model page." }
    ],
    "aiNote": "How this was built: sources were gathered and drafted with AI assistance, then organised into memo, profiles and model. The site itself does not connect to live AI or data feeds; it does not fetch filings or generate research. Search, filtering, scenarios, calculation and export run in the browser."
  },

  "research": {
    "title": "Research",
    "lede": "Study 01 — AI capability acquisitions in go-to-market software. Main case: HubSpot / Dashworks. Comparison: HubSpot / Frame AI.",
    "dealsTitle": "HubSpot acquisitions in the filing, side by side",
    "dealsNote": "Figures are entered in US$ thousands as reported in the Business Combinations note of HubSpot's Form 10-K for fiscal 2025. Retention = post-combination consideration contingent on continued employment, expensed over the stated period rather than included in the purchase price. Extracted for this draft; line-by-line verification against the filing is pending.",
    "deals": [
      { "target": "Dashworks", "capability": "AI workplace search", "closed": "2025-05-01", "price": 18212, "cash": 414, "goodwill": 16653, "tech": 1550, "retention": 6600, "retYears": 3, "txn": 900 },
      { "target": "Frame AI", "capability": "Conversation intelligence", "closed": "2025-01-06", "price": 51444, "cash": 527, "goodwill": 44998, "tech": 6300, "retention": 8200, "retYears": 2, "txn": 1000 },
      { "target": "XFunnel", "capability": "Answer engine optimisation", "closed": "2025-12-01", "price": 17897, "cash": 1440, "goodwill": 16699, "tech": 1450, "retention": 12200, "retYears": 3, "txn": 700 },
      { "target": "Cacheflow", "capability": "Billing & CPQ (non-AI control)", "closed": "2024-10-30", "price": 43522, "cash": 3084, "goodwill": 36383, "tech": 4000, "retention": 24500, "retYears": 2, "txn": 1400 },
      { "target": "Clearbit", "capability": "B2B data enrichment", "closed": "2023-12-01", "price": 146790, "cash": 6420, "goodwill": 127094, "tech": 28900, "retention": 4100, "retYears": 2, "txn": 3400 }
    ],
    "memo": [
      { "kind": "disclosed", "heading": "1. The transaction", "body": "HubSpot announced an agreement to acquire Dashworks, an AI-powered workplace search assistant, on 16 April 2025 and completed the acquisition on 1 May 2025. The Dashworks team joined HubSpot's AI product group to strengthen search and context-gathering across Breeze, HubSpot's AI layer.\n\nPer the fiscal 2025 10-K: total purchase price $18.2m, of which $0.4m was cash acquired, giving net cash of $17.8m. Goodwill was $16.7m and acquired technology $1.6m (five-year life). Separately, about $6.6m of post-combination consideration is contingent on continued employment and is recognised as compensation expense over three years. Transaction costs were about $0.9m." },
      { "kind": "analysis", "heading": "2. Why buy: the capability logic", "body": "HubSpot's AI assistant is only as useful as the context it can reach. Most of a customer's knowledge sits outside the CRM, in documents, chat and other apps. Dashworks had already built connectors and a retrieval-and-reasoning layer over that unstructured data.\n\nGoodwill is about 91% of the price and identified technology under 9%. Read together with the retention package and reports that the standalone product was wound down after the deal, this points to a team-and-know-how acquisition rather than a purchase of revenue. The economic question is therefore not \"what is Dashworks worth on its own\" but \"how much faster and cheaper does HubSpot get this capability than by building it\"."},
      { "kind": "analysis", "heading": "3. Build, partner or buy", "body": "Build: HubSpot has the engineering base, but enterprise search quality depends on connector coverage, permission handling and retrieval tuning that take time to mature. Time-to-market matters because competitors were shipping AI assistants in the same window.\n\nPartner: licensing a third-party search layer is faster but leaves a core part of the AI experience, and the data flowing through it, outside HubSpot's control.\n\nBuy: at roughly $18m plus retention, the price is small relative to HubSpot's scale. The model treats the avoided build cost and the faster launch as the main sources of value, and tests how much incremental revenue is needed on top." },
      { "kind": "analysis", "heading": "4. Comparison: Frame AI", "body": "Frame AI (closed 6 January 2025) also targets unstructured data, but conversations rather than documents: emails, calls and meetings turned into customer insight. The price was larger ($51.4m) with a shorter, smaller retention package relative to price ($8.2m over two years, about 16% of price versus about 36% for Dashworks).\n\nOne reading: Frame AI came with a more developed product and team that HubSpot valued as an asset, while Dashworks' value depended more heavily on keeping specific people. Both deals are dominated by goodwill. The side-by-side table on this page lets the comparison be checked directly." },
      { "kind": "analysis", "heading": "5. What could make the deal fail", "body": "Key-person risk: if the value is the team, attrition after retention vests erodes it. Integration risk: rebuilding a standalone product inside a large platform can take longer than planned. Attribution risk: incremental revenue from a better assistant is hard to measure and easy to overstate. Competitive risk: if search and retrieval become commodity features from model providers, the capability advantage narrows." },
      { "kind": "assumption", "heading": "6. How the model frames it", "body": "Because public disclosure is not enough to build an independent forecast for Dashworks, the model does not invent its revenue or profit. It simulates a hypothetical acquisition of a Dashworks-scale AI capability: the acquirer pays the disclosed consideration and integration costs, carries the retention expense, avoids some internal build cost, and earns incremental cash flow from the capability. NPV changes on the Model page show deal economics under those assumptions, not the actual return on the Dashworks transaction." },
      { "kind": "analysis", "heading": "7. Open questions", "body": "[To be completed by the team after verification: which conclusions we agree or disagree with, and why.]" }
    ],
    "sources": [
      { "label": "HubSpot, Inc. Form 10-K, fiscal year 2025 (Business Combinations note)", "url": "https://www.sec.gov/Archives/edgar/data/1404655/000119312526046646/hubs-20251231.htm" },
      { "label": "HubSpot: HubSpot to acquire Dashworks (16 April 2025)", "url": "https://www.hubspot.com/company-news/hubspot-to-acquire-dashworks" },
      { "label": "HubSpot: Welcoming Frame AI to the HubSpot team (6 December 2024)", "url": "https://www.hubspot.com/company-news/welcoming-frame-ai-to-the-hubspot-team" },
      { "label": "HubSpot completes acquisition of Frame AI (6 January 2025)", "url": "https://www.nasdaq.com/press-release/hubspot-completes-acquisition-ai-powered-conversation-intelligence-platform-frame-ai" },
      { "label": "Vantage Point: What happened to Dashworks.ai (secondary source on product sunset)", "url": "https://vantagepoint.io/blog/hs/what-happened-to-dashworks-ai" }
    ]
  },

  "companies": {
    "title": "Companies",
    "lede": "Ten AI companies acquired by software platforms, grouped by the capability each one added. Search by name, acquirer or problem solved.",
    "list": [
      { "name": "Dashworks", "acquirer": "HubSpot", "date": "2025-05", "price": "$18.2m (10-K)", "capability": "Knowledge & enterprise search", "problem": "Answers workplace questions by searching across a company's documents and apps.", "why": "Gives HubSpot's AI assistant context from data outside the CRM.", "source": "https://www.hubspot.com/company-news/hubspot-to-acquire-dashworks" },
      { "name": "Moveworks", "acquirer": "ServiceNow", "date": "2025-12", "price": "$2.85bn, cash and stock", "capability": "Knowledge & enterprise search", "problem": "AI assistant and enterprise search that resolves employee requests across IT, HR and other functions.", "why": "Adds a conversational front door to ServiceNow's workflow platform.", "source": "https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-completes-acquisition-of-Moveworks/default.aspx" },
      { "name": "Sana", "acquirer": "Workday", "date": "2025-11", "price": "~$1.1bn", "capability": "Knowledge & enterprise search", "problem": "AI agents, search and AI-native learning for enterprises.", "why": "Positions Workday as the employee's starting point for work, beyond HR and finance records.", "source": "https://newsroom.workday.com/2025-11-04-Workday-Completes-Acquisition-of-Sana" },
      { "name": "Frame AI", "acquirer": "HubSpot", "date": "2025-01", "price": "$51.4m (10-K)", "capability": "Conversation intelligence", "problem": "Turns emails, calls and meetings into real-time customer insight.", "why": "Combines unstructured conversation data with HubSpot's structured CRM data.", "source": "https://www.hubspot.com/company-news/welcoming-frame-ai-to-the-hubspot-team" },
      { "name": "Clearbit", "acquirer": "HubSpot", "date": "2023-12", "price": "$146.8m (10-K)", "capability": "Data enrichment", "problem": "Enriches company and contact records with third-party business data.", "why": "Improves the CRM data that HubSpot's AI features depend on.", "source": "https://www.sec.gov/Archives/edgar/data/1404655/000119312526046646/hubs-20251231.htm" },
      { "name": "XFunnel", "acquirer": "HubSpot", "date": "2025-12", "price": "$17.9m (10-K)", "capability": "Marketing & AI search visibility", "problem": "Shows how a brand appears in answers from large language models, and how to improve it (answer engine optimisation).", "why": "Extends HubSpot's marketing tools to discovery through AI answers.", "source": "https://www.hubspot.com/company-news/hubspot-to-acquire-xfunnel" },
      { "name": "Lexion", "acquirer": "DocuSign", "date": "2024-05", "price": "$165m cash (announced)", "capability": "Document & contract intelligence", "problem": "AI-powered contract repository, workflow and data extraction.", "why": "Accelerates DocuSign's move from e-signature to agreement management.", "source": "https://www.docusign.com/company/news-center/docusign-announces-agreement-to-acquire-lexion" },
      { "name": "Casetext", "acquirer": "Thomson Reuters", "date": "2023-08", "price": "$650m cash", "capability": "Document & contract intelligence", "problem": "CoCounsel, an AI legal assistant for research, document review and contract analysis.", "why": "Part of a stated build, partner and buy strategy for generative AI in legal.", "source": "https://www.thomsonreuters.com/en/press-releases/2023/august/thomson-reuters-completes-acquisition-of-casetext-inc.html" },
      { "name": "HiredScore", "acquirer": "Workday", "date": "2024-03", "price": "$530m cash (10-Q)", "capability": "Talent intelligence", "problem": "AI talent orchestration: matching and re-discovering candidates and internal talent.", "why": "Adds AI-driven recruiting and mobility to Workday's talent suite.", "source": "https://www.sec.gov/Archives/edgar/data/1327811/000132781124000165/wday-20240731.htm" },
      { "name": "The Browser Company", "acquirer": "Atlassian", "date": "2025-09", "price": "$610m cash (announced)", "capability": "AI work interface", "problem": "Dia, an AI browser that brings context from SaaS tools into the browser.", "why": "Aims to make the browser Atlassian's AI surface for knowledge work.", "source": "https://techcrunch.com/2025/09/04/atlassian-to-buy-arc-developer-the-browser-company-for-610m" }
    ]
  },

  "model": {
    "title": "Deal Model",
    "lede": "A five-year cash-flow simulation of a hypothetical AI-capability acquisition at Dashworks scale. Change any input and every output recalculates.",
    "caveat": "This is a scenario model, not a valuation of Dashworks. Transaction inputs (price, cash acquired, retention, transaction costs) are anchored to HubSpot's disclosure; operating inputs are our assumptions.",
    "inputs": [
      { "key": "price", "label": "Purchase consideration", "unit": "$m", "group": "Deal", "kind": "disclosed", "step": 0.1 },
      { "key": "cashAcq", "label": "Cash acquired", "unit": "$m", "group": "Deal", "kind": "disclosed", "step": 0.1 },
      { "key": "txn", "label": "Transaction costs", "unit": "$m", "group": "Deal", "kind": "disclosed", "step": 0.1 },
      { "key": "retention", "label": "Retention compensation (total)", "unit": "$m", "group": "Deal", "kind": "disclosed", "step": 0.1 },
      { "key": "retYears", "label": "Retention period", "unit": "yrs", "group": "Deal", "kind": "disclosed", "step": 1 },
      { "key": "integ1", "label": "Integration cost, year 1", "unit": "$m", "group": "Integration", "kind": "assumption", "step": 0.1 },
      { "key": "integ2", "label": "Integration cost, year 2", "unit": "$m", "group": "Integration", "kind": "assumption", "step": 0.1 },
      { "key": "buildAvoided", "label": "Build cost avoided per year", "unit": "$m", "group": "Integration", "kind": "assumption", "step": 0.1 },
      { "key": "buildYears", "label": "Years of build cost avoided", "unit": "yrs", "group": "Integration", "kind": "assumption", "step": 1 },
      { "key": "arr1", "label": "Incremental revenue, year 1", "unit": "$m", "group": "Operating", "kind": "assumption", "step": 0.1 },
      { "key": "growth", "label": "Revenue growth, years 2–5", "unit": "%", "group": "Operating", "kind": "assumption", "step": 1 },
      { "key": "margin", "label": "After-tax cash margin", "unit": "%", "group": "Operating", "kind": "assumption", "step": 1 },
      { "key": "disc", "label": "Discount rate", "unit": "%", "group": "Valuation", "kind": "assumption", "step": 0.5 },
      { "key": "tg", "label": "Terminal growth", "unit": "%", "group": "Valuation", "kind": "assumption", "step": 0.5 }
    ],
    "scenarios": {
      "Bear": { "price": 18.2, "cashAcq": 0.4, "txn": 0.9, "retention": 6.6, "retYears": 3, "integ1": 2.5, "integ2": 1.2, "buildAvoided": 1.5, "buildYears": 2, "arr1": 1.0, "growth": 25, "margin": 25, "disc": 13, "tg": 2 },
      "Base": { "price": 18.2, "cashAcq": 0.4, "txn": 0.9, "retention": 6.6, "retYears": 3, "integ1": 2.0, "integ2": 0.8, "buildAvoided": 3.0, "buildYears": 2, "arr1": 2.0, "growth": 45, "margin": 35, "disc": 12, "tg": 4 },
      "Bull": { "price": 18.2, "cashAcq": 0.4, "txn": 0.9, "retention": 6.6, "retYears": 3, "integ1": 1.5, "integ2": 0.5, "buildAvoided": 3.5, "buildYears": 2, "arr1": 2.5, "growth": 55, "margin": 38, "disc": 11.5, "tg": 4 }
    },
    "notes": [
      { "heading": "How cash flow is built", "body": "Each year: incremental revenue × cash margin, plus build cost avoided, minus integration cost, minus retention compensation spread evenly over its period. Year 0 is the net cash paid (consideration minus cash acquired) plus transaction costs." },
      { "heading": "Terminal value", "body": "Year-5 operating cash flow only (excluding avoided build cost and one-off costs), grown at the terminal rate and capitalised at the discount rate. In most scenarios the terminal value is the largest single component of NPV, which is itself a finding: the deal only works if the capability keeps earning after year 5." },
      { "heading": "Maximum justified price", "body": "The consideration at which NPV equals zero, holding all other inputs fixed. Compare it with the price actually paid." }
    ]
  },

  "log": {
    "title": "Project Log",
    "lede": "What has been done, what has been checked, and what changed after feedback. Planned items are marked as such.",
    "events": [
      { "date": "2026-11-21", "type": "Draft", "title": "Study 01 first draft published", "text": "Research memo, ten company profiles, the deal model and this site completed as a working draft. Figures not yet independently verified by the team." },
      { "date": "2026-12", "type": "Planned · Verification", "title": "Verify every disclosed figure against the 10-K", "text": "Re-read the Business Combinations note line by line; confirm price, cash acquired, goodwill, technology and retention for all five HubSpot deals; record any corrections here." },
      { "date": "2026-12", "type": "Planned · Judgment", "title": "Team position on the memo", "text": "Write down where we agree or disagree with the draft conclusions, with reasons." },
      { "date": "2027-01", "type": "Planned · Modelling", "title": "Ground the assumptions", "text": "Replace placeholder operating assumptions with evidence-based ranges and document the source for each." },
      { "date": "2027-01", "type": "Planned · Feedback", "title": "Outside review", "text": "Ask classmates, faculty and practitioners to challenge the analysis; log their feedback and our revisions." }
    ]
  },

  "team": {
    "title": "Team",
    "lede": "A student group project. Roles reflect the next phase of work: verification, judgment, modelling and outside validation.",
    "members": [
      { "name": "[Member name]", "role": "[Programme, year] · Verification", "note": "[Checks disclosed figures against primary filings.]" },
      { "name": "[Member name]", "role": "[Programme, year] · Modelling", "note": "[Owns model logic and assumption ranges.]" },
      { "name": "[Member name]", "role": "[Programme, year] · Research & memo", "note": "[Owns the deal narrative and comparisons.]" },
      { "name": "[Member name]", "role": "[Programme, year] · Validation", "note": "[Runs outside reviews and keeps the feedback log.]" }
    ],
    "advisorsTitle": "Advisors and reviewers",
    "advisors": [
      { "name": "[Name]", "role": "[Title, institution]", "note": "[How they helped.]" }
    ]
  }
};
