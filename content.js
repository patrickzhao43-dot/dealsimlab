/* =====================================================================
   SITE CONTENT: every word, deal figure, company profile, reference and
   model default lives in this file.
   - Edit by hand, or open the site with ?edit, change text on the page,
     click "Export content.js" and replace this file.
   - Money in US$ millions unless a field says otherwise (deal table: US$ thousands).
   - Citations: write [n] in text to cite reference n (see "references").
   - kind: "disclosed" = from a filing or official release,
           "analysis"  = our interpretation,
           "assumption" = model input chosen by us.
   ===================================================================== */
window.SITE = {
  "settings": {
    "siteName": "DealSim Lab",
    "tagline": "Simulating the economics of software M&A",
    "email": "",
    "footerNote": "Student research project. Draft analysis, not investment advice."
  },
  "home": {
    "eyebrow": "Study 01 · AI Deal Lab",
    "title": "Why do software companies buy AI companies, and when does the deal pay for itself?",
    "lede": "DealSim Lab is a research workbench for software M&A. Each study takes a real transaction, separates what was disclosed from what we infer, and simulates the conditions under which the deal creates more value than it costs.",
    "status": "Status: working draft, figures source-checked. Every disclosed number has been checked against the original filing or release (23 Nov 2026) and is referenced on the References page. Team review, outside feedback and ongoing updates are logged on the Log page.",
    "question": "Study 01 asks: why did HubSpot acquire Dashworks, and under what conditions does an AI-capability acquisition create value above its all-in cost?",
    "layers": [
      {
        "layer": "Industry & product",
        "question": "What problem does each AI company solve?",
        "where": "10 company profiles, grouped by capability",
        "route": "companies"
      },
      {
        "layer": "Deal logic",
        "question": "Why buy, rather than build or partner?",
        "where": "Dashworks main case, Frame AI comparison, research memo",
        "route": "research"
      },
      {
        "layer": "Financial return",
        "question": "What revenue, margin and synergy make the price worth paying?",
        "where": "Five-year cash-flow model, NPV, five historical deal simulations, three scenarios, sensitivity",
        "route": "model"
      },
      {
        "layer": "Evidence",
        "question": "Where does each number come from?",
        "where": "Numbered references to filings, releases and official data",
        "route": "references"
      }
    ],
    "finding": "\"What did the acquisition cost?\" has no single answer. HubSpot's filings separate the purchase consideration, the net cash paid after cash acquired, and compensation tied to continued employment, which is expensed after closing rather than counted in the price. For Dashworks those are $18.2m, $17.8m and about $6.6m. Treating retention as part of the economic cost changes how the deal should be judged.",
    "method": [
      {
        "kind": "disclosed",
        "title": "Disclosed facts",
        "text": "Acquisition dates, purchase consideration, cash acquired, goodwill, acquired technology and post-combination compensation, taken from HubSpot's SEC filings and official announcements."
      },
      {
        "kind": "analysis",
        "title": "Analysis",
        "text": "Why the capabilities fit, how synergies could arise, and which factors could make the deal fail. These are our judgments and are labelled as such."
      },
      {
        "kind": "assumption",
        "title": "Model assumptions",
        "text": "Revenue growth, cash margin, synergy, avoided build cost and discount rate. Chosen by us, shown openly, and adjustable on the Model page."
      }
    ],
    "aiNote": "How this was built: sources were gathered and drafted with AI assistance, then organised into memo, profiles and model. The site itself does not connect to live AI or data feeds; it does not fetch filings or generate research. Search, filtering, scenarios, calculation and export run in the browser.",
    "finding2": "Simulated with inputs fixed at each closing date, all five HubSpot deals need year-1 incremental revenue of roughly 35–45% of the purchase price just to break even. For the three 2025 deals that is about $32m combined, against HubSpot's statement that the three businesses were under 1% of its 2025 revenue (about $31m). The return has to come from inside HubSpot's platform, not from the acquired products' own sales."
  },
  "research": {
    "title": "Research",
    "lede": "Study 01: AI capability acquisitions in go-to-market software. Main case: HubSpot / Dashworks. Comparison: HubSpot / Frame AI. Cross-check: all five HubSpot acquisitions disclosed in the 2025 10-K.",
    "dealsTitle": "HubSpot acquisitions in the filing, side by side",
    "dealsNote": "Source: HubSpot FY2025 Form 10-K, Note 8 (Business Acquisitions) [1]; figures entered in US$ thousands as reported. Checked against the filing text on 23 Nov 2026. XFunnel's allocation is preliminary (measurement period open). Clearbit was acquired as APIHub, Inc. Retention = post-combination consideration contingent on continued employment, expensed over the stated period and not part of the purchase price.",
    "deals": [
      {
        "target": "Dashworks",
        "capability": "AI workplace search",
        "closed": "2025-05-01",
        "price": 18212,
        "cash": 414,
        "goodwill": 16653,
        "tech": 1550,
        "retention": 6600,
        "retYears": 3,
        "txn": 900,
        "ref": 1
      },
      {
        "target": "Frame AI",
        "capability": "Conversation intelligence",
        "closed": "2025-01-06",
        "price": 51444,
        "cash": 527,
        "goodwill": 44998,
        "tech": 6300,
        "retention": 8200,
        "retYears": 2,
        "txn": 1000,
        "ref": 1
      },
      {
        "target": "XFunnel",
        "capability": "Answer engine optimisation",
        "closed": "2025-12-01",
        "price": 17897,
        "cash": 1440,
        "goodwill": 16699,
        "tech": 1450,
        "retention": 12200,
        "retYears": 3,
        "txn": 700,
        "ref": 1
      },
      {
        "target": "Cacheflow",
        "capability": "Billing & CPQ (non-AI control)",
        "closed": "2024-10-30",
        "price": 43522,
        "cash": 3084,
        "goodwill": 36383,
        "tech": 4000,
        "retention": 24500,
        "retYears": 2,
        "txn": 1400,
        "ref": 1
      },
      {
        "target": "Clearbit",
        "capability": "B2B data enrichment",
        "closed": "2023-12-01",
        "price": 146790,
        "cash": 6420,
        "goodwill": 127094,
        "tech": 28900,
        "retention": 4100,
        "retYears": 2,
        "txn": 3400,
        "ref": 1
      }
    ],
    "memo": [
      {
        "kind": "disclosed",
        "heading": "1. The transaction",
        "body": "HubSpot announced an agreement to acquire Dashworks, an AI-powered workplace search assistant, on 16 April 2025 and completed the acquisition on 1 May 2025. The Dashworks team joined HubSpot's AI product group to strengthen search and context-gathering across Breeze, HubSpot's AI layer [6].\n\nPer the fiscal 2025 10-K: total purchase price $18.2m, of which $0.4m was cash acquired, giving net cash of $17.8m. Goodwill was $16.7m and acquired technology $1.6m (five-year life). Separately, about $6.6m of post-combination consideration is contingent on continued employment and is recognised as compensation expense over three years. Transaction costs were about $0.9m [1]."
      },
      {
        "kind": "analysis",
        "heading": "2. Why buy: the capability logic",
        "body": "HubSpot's AI assistant is only as useful as the context it can reach. Most of a customer's knowledge sits outside the CRM, in documents, chat and other apps. Dashworks had already built connectors and a retrieval-and-reasoning layer over that unstructured data.\n\nGoodwill is about 91% of the price and identified technology under 9%. Read together with the retention package and reports that the standalone product was wound down after the deal [17], this points to a team-and-know-how acquisition rather than a purchase of revenue. The economic question is therefore not \"what is Dashworks worth on its own\" but \"how much faster and cheaper does HubSpot get this capability than by building it\"."
      },
      {
        "kind": "analysis",
        "heading": "3. Build, partner or buy",
        "body": "Build: HubSpot has the engineering base, but enterprise search quality depends on connector coverage, permission handling and retrieval tuning that take time to mature. Time-to-market matters because competitors were shipping AI assistants in the same window.\n\nPartner: licensing a third-party search layer is faster but leaves a core part of the AI experience, and the data flowing through it, outside HubSpot's control.\n\nBuy: at roughly $18m plus retention, the price is small relative to HubSpot's scale. The model treats the avoided build cost and the faster launch as the main sources of value, and tests how much incremental revenue is needed on top."
      },
      {
        "kind": "analysis",
        "heading": "4. Comparison: Frame AI",
        "body": "Frame AI (closed 6 January 2025) also targets unstructured data, but conversations rather than documents: emails, calls and meetings turned into customer insight [7]. The price was larger ($51.4m) with a shorter, smaller retention package relative to price ($8.2m over two years, about 16% of price versus about 36% for Dashworks) [1].\n\nOne reading: Frame AI came with a more developed product and team that HubSpot valued as an asset, while Dashworks' value depended more heavily on keeping specific people. Both deals are dominated by goodwill. The side-by-side table on this page lets the comparison be checked directly."
      },
      {
        "kind": "analysis",
        "heading": "5. What could make the deal fail",
        "body": "Key-person risk: if the value is the team, attrition after retention vests erodes it. Integration risk: rebuilding a standalone product inside a large platform can take longer than planned. Attribution risk: incremental revenue from a better assistant is hard to measure and easy to overstate. Competitive risk: if search and retrieval become commodity features from model providers, the capability advantage narrows."
      },
      {
        "kind": "assumption",
        "heading": "6. How the model frames it",
        "body": "Because public disclosure is not enough to build an independent forecast for Dashworks, the model does not invent its revenue or profit. It simulates a hypothetical acquisition of a Dashworks-scale AI capability: the acquirer pays the disclosed consideration and integration costs, carries the retention expense, avoids some internal build cost, and earns incremental cash flow from the capability. NPV changes on the Model page show deal economics under those assumptions, not the actual return on the Dashworks transaction."
      },
      {
        "kind": "analysis",
        "heading": "7. Simulating all five HubSpot deals",
        "body": "Each deal is simulated with inputs fixed at the time of closing: the disclosed price, cash acquired, transaction costs and retention [1]; a discount rate of the 10-year Treasury yield on the closing date [3] plus 1.2 × the prevailing implied equity risk premium [4, 5] plus a 2% acquisition-risk premium; HubSpot's own reported revenue growth and free-cash-flow margin in the year of closing as the growth and margin anchors [1, 2]; and the fair value of acquired technology, which HubSpot valued on a replacement-cost basis for four of the five deals, as a one-off build cost avoided [1].\nBecause the targets' own revenue is not disclosed, the simulation solves for the year-1 incremental revenue at which NPV equals zero. At default assumptions the break-even revenue is about 35–45% of the purchase price for every deal, i.e. HubSpot paid roughly 2.3–2.9× the revenue the capability must add in its first year.\nA cross-check: HubSpot states that Frame AI, Dashworks and XFunnel together represented less than 1% of 2025 consolidated revenue, i.e. under about $31m and only a partial year [1]. Their combined break-even year-1 revenue in our simulation is about $32m. On these assumptions the acquired products' own sales cannot carry the price; the return has to come from value created inside HubSpot's platform."
      },
      {
        "kind": "analysis",
        "heading": "8. Open questions",
        "body": "Is the replacement-cost value of acquired technology a fair proxy for the build cost HubSpot avoided, or does it understate the value of time-to-market?\nHow much of each capability's value shows up as HubSpot revenue (attach, pricing, retention) versus defensive value that never appears as revenue?\nWhy did retention packages range from 3% of price (Clearbit) to 68% (XFunnel)? Does a higher share signal a team-driven deal?\n[Team position to add after verification: where we agree or disagree with this draft, and why.]"
      }
    ],
    "primary": "Primary sources: HubSpot FY2025 10-K [1], HubSpot FY2023 10-K [2], Federal Reserve H.15 Treasury yields [3], Damodaran implied equity risk premiums [4, 5], and acquirer announcements [6–16]."
  },
  "companies": {
    "title": "Companies",
    "lede": "Ten AI companies acquired by software platforms, grouped by the capability each one added. Search by name, acquirer or problem solved.",
    "list": [
      {
        "name": "Dashworks",
        "acquirer": "HubSpot",
        "date": "2025-05-01",
        "price": "$18.2m purchase price",
        "capability": "Knowledge & enterprise search",
        "problem": "Answers workplace questions by searching across a company's documents and apps.",
        "why": "Gives HubSpot's AI assistant context from data outside the CRM.",
        "refs": [
          1,
          6
        ]
      },
      {
        "name": "Moveworks",
        "acquirer": "ServiceNow",
        "date": "2025-12-15",
        "price": "$2.85bn, cash and stock (announced Mar 2025)",
        "capability": "Knowledge & enterprise search",
        "problem": "AI assistant and enterprise search that resolves employee requests across IT, HR and other functions.",
        "why": "Adds a conversational front door to ServiceNow's workflow platform.",
        "refs": [
          9,
          10
        ]
      },
      {
        "name": "Sana",
        "acquirer": "Workday",
        "date": "2025-11-04",
        "price": "~$1.1bn",
        "capability": "Knowledge & enterprise search",
        "problem": "AI agents, search and AI-native learning for enterprises.",
        "why": "Positions Workday as the employee's starting point for work, beyond HR and finance records.",
        "refs": [
          11,
          12
        ]
      },
      {
        "name": "Frame AI",
        "acquirer": "HubSpot",
        "date": "2025-01-06",
        "price": "$51.4m purchase price",
        "capability": "Conversation intelligence",
        "problem": "Turns emails, calls and meetings into real-time customer insight.",
        "why": "Combines unstructured conversation data with HubSpot's structured CRM data.",
        "refs": [
          1,
          7
        ]
      },
      {
        "name": "Clearbit (APIHub, Inc.)",
        "acquirer": "HubSpot",
        "date": "2023-12-01",
        "price": "$146.8m purchase price",
        "capability": "Data enrichment",
        "problem": "Enriches company and contact records with third-party business data.",
        "why": "Improves the CRM data that HubSpot's AI features depend on.",
        "refs": [
          1
        ]
      },
      {
        "name": "XFunnel",
        "acquirer": "HubSpot",
        "date": "2025-12-01",
        "price": "$17.9m purchase price (preliminary)",
        "capability": "Marketing & AI search visibility",
        "problem": "Shows how a brand appears in answers from large language models, and how to improve it (answer engine optimisation).",
        "why": "Extends HubSpot's marketing tools to discovery through AI answers.",
        "refs": [
          1,
          8
        ]
      },
      {
        "name": "Lexion",
        "acquirer": "DocuSign",
        "date": "2024-05",
        "price": "$165m cash (announced)",
        "capability": "Document & contract intelligence",
        "problem": "AI-powered contract repository, workflow and data extraction.",
        "why": "Accelerates DocuSign's move from e-signature to agreement management.",
        "refs": [
          13
        ]
      },
      {
        "name": "Casetext",
        "acquirer": "Thomson Reuters",
        "date": "2023-08-17",
        "price": "$650m cash",
        "capability": "Document & contract intelligence",
        "problem": "CoCounsel, an AI legal assistant for research, document review and contract analysis.",
        "why": "Part of a stated build, partner and buy strategy for generative AI in legal.",
        "refs": [
          14
        ]
      },
      {
        "name": "HiredScore",
        "acquirer": "Workday",
        "date": "2024-03-29",
        "price": "$530m cash",
        "capability": "Talent intelligence",
        "problem": "AI talent orchestration: matching and re-discovering candidates and internal talent.",
        "why": "Adds AI-driven recruiting and mobility to Workday's talent suite.",
        "refs": [
          15
        ]
      },
      {
        "name": "The Browser Company",
        "acquirer": "Atlassian",
        "date": "2025-09",
        "price": "~$610m cash, incl. its cash balance (announced)",
        "capability": "AI work interface",
        "problem": "Dia, an AI browser that brings context from SaaS tools into the browser.",
        "why": "Aims to make the browser Atlassian's AI surface for knowledge work.",
        "refs": [
          16
        ]
      }
    ],
    "note": "Dates are closing dates where an official completion notice or filing was found; otherwise the announcement month, marked \"announced\"."
  },
  "model": {
    "title": "Deal Model",
    "lede": "A five-year cash-flow simulation of AI-capability acquisitions. Load one of HubSpot's five disclosed deals with inputs fixed at its closing date, or use the illustrative Dashworks scenarios. Every output recalculates as you change an input.",
    "caveat": "A scenario model, not a valuation of any company. Deal terms come from filings; market inputs come from official data at each closing date; operating inputs are labelled assumptions.",
    "inputs": [
      {
        "key": "price",
        "label": "Purchase consideration",
        "unit": "$m",
        "group": "Deal",
        "kind": "disclosed",
        "step": 0.1
      },
      {
        "key": "cashAcq",
        "label": "Cash acquired",
        "unit": "$m",
        "group": "Deal",
        "kind": "disclosed",
        "step": 0.1
      },
      {
        "key": "txn",
        "label": "Transaction costs",
        "unit": "$m",
        "group": "Deal",
        "kind": "disclosed",
        "step": 0.1
      },
      {
        "key": "retention",
        "label": "Retention compensation (total)",
        "unit": "$m",
        "group": "Deal",
        "kind": "disclosed",
        "step": 0.1
      },
      {
        "key": "retYears",
        "label": "Retention period",
        "unit": "yrs",
        "group": "Deal",
        "kind": "disclosed",
        "step": 1
      },
      {
        "key": "integ1",
        "label": "Integration cost, year 1",
        "unit": "$m",
        "group": "Integration",
        "kind": "assumption",
        "step": 0.1
      },
      {
        "key": "integ2",
        "label": "Integration cost, year 2",
        "unit": "$m",
        "group": "Integration",
        "kind": "assumption",
        "step": 0.1
      },
      {
        "key": "buildAvoided",
        "label": "Build cost avoided per year",
        "unit": "$m",
        "group": "Integration",
        "kind": "assumption",
        "step": 0.1
      },
      {
        "key": "buildYears",
        "label": "Years of build cost avoided",
        "unit": "yrs",
        "group": "Integration",
        "kind": "assumption",
        "step": 1
      },
      {
        "key": "arr1",
        "label": "Incremental revenue, year 1",
        "unit": "$m",
        "group": "Operating",
        "kind": "assumption",
        "step": 0.1
      },
      {
        "key": "growth",
        "label": "Revenue growth, years 2–5",
        "unit": "%",
        "group": "Operating",
        "kind": "assumption",
        "step": 1
      },
      {
        "key": "margin",
        "label": "After-tax cash margin",
        "unit": "%",
        "group": "Operating",
        "kind": "assumption",
        "step": 1
      },
      {
        "key": "disc",
        "label": "Discount rate",
        "unit": "%",
        "group": "Valuation",
        "kind": "assumption",
        "step": 0.5
      },
      {
        "key": "tg",
        "label": "Terminal growth",
        "unit": "%",
        "group": "Valuation",
        "kind": "assumption",
        "step": 0.5
      }
    ],
    "scenarios": {
      "Bear": {
        "price": 18.2,
        "cashAcq": 0.4,
        "txn": 0.9,
        "retention": 6.6,
        "retYears": 3,
        "integ1": 2.5,
        "integ2": 1.2,
        "buildAvoided": 1.5,
        "buildYears": 2,
        "arr1": 1.0,
        "growth": 25,
        "margin": 25,
        "disc": 13,
        "tg": 2
      },
      "Base": {
        "price": 18.2,
        "cashAcq": 0.4,
        "txn": 0.9,
        "retention": 6.6,
        "retYears": 3,
        "integ1": 2.0,
        "integ2": 0.8,
        "buildAvoided": 3.0,
        "buildYears": 2,
        "arr1": 2.0,
        "growth": 45,
        "margin": 35,
        "disc": 12,
        "tg": 4
      },
      "Bull": {
        "price": 18.2,
        "cashAcq": 0.4,
        "txn": 0.9,
        "retention": 6.6,
        "retYears": 3,
        "integ1": 1.5,
        "integ2": 0.5,
        "buildAvoided": 3.5,
        "buildYears": 2,
        "arr1": 2.5,
        "growth": 55,
        "margin": 38,
        "disc": 11.5,
        "tg": 4
      }
    },
    "notes": [
      {
        "heading": "How cash flow is built",
        "body": "Each year: incremental revenue × cash margin, plus build cost avoided, minus integration cost, minus retention compensation spread evenly over its period. Year 0 is the net cash paid (consideration minus cash acquired) plus transaction costs."
      },
      {
        "heading": "Terminal value",
        "body": "Year-5 operating cash flow only (excluding avoided build cost and one-off costs), grown at the terminal rate and capitalised at the discount rate. In most scenarios the terminal value is the largest single component of NPV, which is itself a finding: the deal only works if the capability keeps earning after year 5."
      },
      {
        "heading": "Maximum justified price",
        "body": "The consideration at which NPV equals zero, holding all other inputs fixed. Compare it with the price actually paid."
      }
    ],
    "acquirer": {
      "name": "HubSpot",
      "ref": [
        1,
        2
      ],
      "years": {
        "2022": {
          "revenue": 1730969
        },
        "2023": {
          "revenue": 2170230,
          "cfo": 350971,
          "capex": 33718,
          "capsw": 66372
        },
        "2024": {
          "revenue": 2627543,
          "cfo": 598599,
          "capex": 37939,
          "capsw": 89636
        },
        "2025": {
          "revenue": 3131266,
          "cfo": 760717,
          "capex": 53165,
          "capsw": 130624
        }
      }
    },
    "simAssumptions": {
      "beta": 1.2,
      "premium": 2.0,
      "tg": 3.0,
      "integ1Pct": 10,
      "integ2Pct": 5
    },
    "presets": [
      {
        "deal": "Clearbit",
        "rf": 4.22,
        "rfDate": "2023-12-01",
        "erp": 5.94,
        "erpDate": "start of 2023",
        "erpRef": 4,
        "year": "2023"
      },
      {
        "deal": "Cacheflow",
        "rf": 4.29,
        "rfDate": "2024-10-30",
        "erp": 4.6,
        "erpDate": "start of 2024",
        "erpRef": 4,
        "year": "2024"
      },
      {
        "deal": "Frame AI",
        "rf": 4.62,
        "rfDate": "2025-01-06",
        "erp": 4.33,
        "erpDate": "start of 2025",
        "erpRef": 5,
        "year": "2025"
      },
      {
        "deal": "Dashworks",
        "rf": 4.25,
        "rfDate": "2025-05-01",
        "erp": 4.33,
        "erpDate": "start of 2025",
        "erpRef": 5,
        "year": "2025"
      },
      {
        "deal": "XFunnel",
        "rf": 4.09,
        "rfDate": "2025-12-01",
        "erp": 4.33,
        "erpDate": "start of 2025",
        "erpRef": 5,
        "year": "2025"
      }
    ],
    "presetsNote": "Historical presets fix every input at the time of closing. Disclosed: price, cash acquired, transaction costs, retention and acquired-technology value [1]; 10-year Treasury yield on the closing date [3]; implied equity risk premium in effect [4, 5]; HubSpot's reported revenue growth and free-cash-flow margin (operating cash flow minus capital expenditure and capitalised software, over revenue) for the closing year [1, 2]. Assumed: beta 1.2, acquisition-risk premium 2%, terminal growth 3%, integration cost 10% then 5% of price. Year-1 revenue is not disclosed, so each preset opens at its break-even level: move it to see how far above or below break-even the capability must perform."
  },
  "log": {
    "title": "Project Log",
    "lede": "What has been done, what has been checked, and what changed after feedback. Planned items are marked as such.",
    "events": [
      {
        "date": "2026-11-21",
        "type": "Draft",
        "title": "Study 01 first draft published",
        "text": "Research memo, ten company profiles, the deal model and this site completed as a working draft. Figures not yet independently verified by the team."
      },
      {
        "date": "2026-11-23",
        "type": "Verification",
        "title": "Figures checked against primary sources; five deal simulations added",
        "text": "All five HubSpot acquisitions re-checked line by line against Note 8 of the FY2025 10-K (one correction: the note is titled Business Acquisitions). Peer deal prices matched to acquirer releases or SEC filings. Historical simulations added using Treasury yields and implied equity risk premiums at each closing date. Numbered references added.",
        "images": []
      },
      {
        "date": "2026-12",
        "type": "Planned · Verification",
        "title": "Team sign-off on the verified figures",
        "text": "Each member re-reads the cited sources for their section and signs off, so the verification is independent of the first draft."
      },
      {
        "date": "2026-12",
        "type": "Planned · Judgment",
        "title": "Team position on the memo",
        "text": "Write down where we agree or disagree with the draft conclusions, with reasons."
      },
      {
        "date": "2027-01",
        "type": "Planned · Modelling",
        "title": "Ground the assumptions",
        "text": "Replace placeholder operating assumptions with evidence-based ranges and document the source for each."
      },
      {
        "date": "2027-01",
        "type": "Planned · Feedback",
        "title": "Outside review",
        "text": "Ask classmates, faculty and practitioners to challenge the analysis; log their feedback and our revisions."
      }
    ]
  },
  "team": {
    "title": "Team",
    "lede": "A student research group across five universities in the United States, mainland China, Singapore and Hong Kong, combining finance, economics, engineering and AI.",
    "members": [
      {
        "name": "Patrick Zhao",
        "role": "Founder & Organizer",
        "note": "NYU Stern School of Business · Sophomore\nFinance major, Mathematics minor",
        "photo": ""
      },
      {
        "name": "Fangrui Liu",
        "role": "Researcher",
        "note": "Penn State University · Sophomore\nMaterials Science major, Physics minor",
        "photo": ""
      },
      {
        "name": "Sam Yu",
        "role": "Macroeconomic Observation",
        "note": "Renmin University of China · Sophomore\nPublic Finance",
        "photo": ""
      },
      {
        "name": "Bruce Zhang",
        "role": "Quantitative Analysis",
        "note": "Nanyang Technological University · Sophomore\nElectrical and Electronic Engineering",
        "photo": ""
      },
      {
        "name": "Stephen Peng",
        "role": "AI Industry Research",
        "note": "Hong Kong University of Science and Technology · Sophomore\nArtificial Intelligence",
        "photo": ""
      }
    ],
    "advisorsTitle": "Advisors and reviewers",
    "advisors": []
  },
  "references": {
    "title": "References",
    "lede": "Every disclosed figure on this site traces to one of these sources. Primary sources (SEC filings, acquirer releases, Federal Reserve data) are used wherever they exist; secondary sources are marked as such.",
    "list": [
      {
        "id": 1,
        "label": "HubSpot, Inc. Form 10-K for fiscal year 2025: Note 8 (Business Acquisitions), consolidated statements of operations and cash flows",
        "publisher": "U.S. SEC (EDGAR)",
        "date": "2026-02",
        "url": "https://www.sec.gov/Archives/edgar/data/1404655/000119312526046646/hubs-20251231.htm"
      },
      {
        "id": 2,
        "label": "HubSpot, Inc. Form 10-K for fiscal year 2023: consolidated statements of operations (2022 revenue)",
        "publisher": "U.S. SEC (EDGAR)",
        "date": "2024-02",
        "url": "https://www.sec.gov/Archives/edgar/data/1404655/000095017024015277/hubs-20231231.htm"
      },
      {
        "id": 3,
        "label": "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity (DGS10), H.15 Selected Interest Rates",
        "publisher": "Board of Governors of the Federal Reserve System, via FRED",
        "date": "daily",
        "url": "https://fred.stlouisfed.org/series/DGS10"
      },
      {
        "id": 4,
        "label": "Damodaran, A. Data Update 2 for 2024: implied equity risk premium at the start of 2023 (5.94%) and 2024 (4.60%)",
        "publisher": "NYU Stern",
        "date": "2024-01",
        "url": "https://aswathdamodaran.blogspot.com/2024/01/data-update-2-for-2024-stock-comeback.html"
      },
      {
        "id": 5,
        "label": "Damodaran, A. Data Update 5 for 2025: implied equity risk premium for the S&P 500 at the start of 2025 (4.33%)",
        "publisher": "NYU Stern",
        "date": "2025-02",
        "url": "https://aswathdamodaran.substack.com/p/data-update-5-for-2025-its-a-small"
      },
      {
        "id": 6,
        "label": "HubSpot to acquire Dashworks",
        "publisher": "HubSpot",
        "date": "2025-04-16",
        "url": "https://www.hubspot.com/company-news/hubspot-to-acquire-dashworks"
      },
      {
        "id": 7,
        "label": "Welcoming Frame AI to the HubSpot team",
        "publisher": "HubSpot",
        "date": "2024-12-06",
        "url": "https://www.hubspot.com/company-news/welcoming-frame-ai-to-the-hubspot-team"
      },
      {
        "id": 8,
        "label": "HubSpot to acquire XFunnel",
        "publisher": "HubSpot",
        "date": "2025-10",
        "url": "https://www.hubspot.com/company-news/hubspot-to-acquire-xfunnel"
      },
      {
        "id": 9,
        "label": "ServiceNow completes acquisition of Moveworks",
        "publisher": "ServiceNow",
        "date": "2025-12-15",
        "url": "https://investor.servicenow.com/news/news-details/2025/ServiceNow-completes-acquisition-of-Moveworks/default.aspx"
      },
      {
        "id": 10,
        "label": "O'Melveny advises Moveworks on US$2.85 billion acquisition by ServiceNow (deal value)",
        "publisher": "O'Melveny & Myers (Moveworks' counsel)",
        "date": "2025-03-10",
        "url": "https://omm.com/news/press-releases/o-melveny-advises-moveworks-on-us-285-billion-acquisition-by-servicenow"
      },
      {
        "id": 11,
        "label": "Workday signs definitive agreement to acquire Sana (approximately $1.1 billion)",
        "publisher": "Workday",
        "date": "2025-09-16",
        "url": "https://investor.workday.com/news-and-events/press-releases/news-details/2025/Workday-Signs-Definitive-Agreement-to-Acquire-Sana-09-16-2025/default.aspx"
      },
      {
        "id": 12,
        "label": "Workday completes acquisition of Sana",
        "publisher": "Workday",
        "date": "2025-11-04",
        "url": "https://investor.workday.com/news-and-events/press-releases/news-details/2025/Workday-Completes-Acquisition-of-Sana-11-04-2025/default.aspx"
      },
      {
        "id": 13,
        "label": "Docusign announces agreement to acquire Lexion ($165 million in cash)",
        "publisher": "Docusign",
        "date": "2024-05-06",
        "url": "https://www.docusign.com/company/news-center/docusign-announces-agreement-to-acquire-lexion"
      },
      {
        "id": 14,
        "label": "Thomson Reuters completes acquisition of Casetext, Inc. ($650 million in cash)",
        "publisher": "Thomson Reuters",
        "date": "2023-08-17",
        "url": "https://www.thomsonreuters.com/en/press-releases/2023/august/thomson-reuters-completes-acquisition-of-casetext-inc.html"
      },
      {
        "id": 15,
        "label": "Workday, Inc. Form 10-Q, quarter ended 31 July 2024: Note 7 (HiredScore acquisition, $530 million cash)",
        "publisher": "U.S. SEC (EDGAR)",
        "date": "2024-08",
        "url": "https://www.sec.gov/Archives/edgar/data/1327811/000132781124000165/wday-20240731.htm"
      },
      {
        "id": 16,
        "label": "Atlassian enters into definitive agreement to acquire The Browser Company of New York (approx. $610 million in cash, inclusive of its cash balance)",
        "publisher": "Atlassian, via Business Wire",
        "date": "2025-09-04",
        "url": "https://www.barchart.com/story/news/34594705/atlassian-enters-into-definitive-agreement-to-acquire-the-browser-company-of-new-york"
      },
      {
        "id": 17,
        "label": "What happened to Dashworks.ai (secondary source on the standalone product's wind-down)",
        "publisher": "Vantage Point",
        "date": "2025",
        "url": "https://vantagepoint.io/blog/hs/what-happened-to-dashworks-ai"
      }
    ]
  }
};
