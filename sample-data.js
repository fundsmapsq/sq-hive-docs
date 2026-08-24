/* Sample data drawn from the real SQ HIVE payloads.
   These power the live UI demos when no API key is available. */

window.SQ_SAMPLES = (function () {

  /* ─── Filter categories ─── */
  const filterCategories = [
    {
      name: "KEY_UPDATE",
      color: "#ec4899",
      title: "Key updates",
      desc: "Block deals, bulk deals, promoter trades — the high-signal stuff your end-user wants pushed.",
      sample: { title: "Shriram Finance Limited", desc: "💎 Block Deal on 2024-06-18 · ₹401 cr changed hands" }
    },
    {
      name: "ANALYTICAL_UPDATE",
      color: "#00f0ff",
      title: "Analytical updates",
      desc: "Broker reports, target prices, recommendations — research-grade signal extracted into structured form.",
      sample: { title: "Zomato Ltd.", desc: "SBI Securities issued BUY · 12-mo target ₹214" }
    },
    {
      name: "MEDIA_COVERAGE",
      color: "#a855f7",
      title: "Media coverage",
      desc: "Video, TV, and press appearances. Surface news the moment it breaks on broadcast.",
      sample: { title: "M&M", desc: "'Best Performing Nifty Stock 2002-2024'" }
    },
    {
      name: "SPVMA",
      color: "#f5b042",
      title: "Volume & price spikes",
      desc: "Unusual trading activity vs. trailing averages. Catch heat before it hits the tape.",
      sample: { title: "Kalpataru Projects International", desc: "🔥 10× normal volume · 34L shares · ₹413 cr" }
    },
    {
      name: "EVENT_SCHEDULE",
      color: "#10e0a0",
      title: "Event schedule",
      desc: "Board meetings, analyst meets, dividend announcements — every upcoming catalyst, calendarized.",
      sample: { title: "Kirloskar Oil Engines", desc: "💼 Virtual analyst meeting with Antique Securities" }
    },
    {
      name: "TECHNICAL_IDEA",
      color: "#6ef0ff",
      title: "Technical ideas",
      desc: "Chart-driven trade ideas with pattern detection. Long/short with rationale.",
      sample: { title: "COROMANDEL", desc: "Long · Cup pattern · NSE" }
    },
    {
      name: "UNCLASSIFIED",
      color: "#aeb4cc",
      title: "Unclassified",
      desc: "Everything else that warrants delivery but doesn't fit a curated bucket — restructurings, niche disclosures, etc.",
      sample: { title: "Amber Enterprises India", desc: "NCLT first-motion application order" }
    }
  ];

  /* ─── Listing response for /query (multiple items showing variety) ─── */
  const querySample = {
    instrumentUpdateMessages: [
      {
        id: "844612012360130364",
        title: "Birla Precision Technologies Ltd",
        description: "📅 Board Meeting Scheduled for Financial Results & Dividend",
        content: "📍Key Insight: Board meeting on May 22, 2026; Approved Audited Standalone & Consolidated results for FY ending March 31, 2026; Final dividend recommendation to be discussed; Trading window closed from March 27, 2026 until 48 hours post results announcement",
        scripDetails: { bseScripCode: "522105", scripName: "Birla Precision Technologies Ltd", bseTickr: "BIRLAPREC", nseTickr: null, isin: "INE372E01025" },
        linkDetail: { shortLink: "https://sqst.in/mMHzW", linkSource: "ScoutQuest.in" },
        creationTime: 1779207995,
        filterCategory: "EVENT_SCHEDULE",
        proFunnel: {
          sentiment: "neutral",
          bytes: [
            { tag: "Board Meeting Date", data: "2026-05-22" },
            { tag: "FY End Date", data: "2026-03-31" },
            { tag: "Results Approval", data: "Audited standalone & consolidated" }
          ],
          classificationJson: { smartTag: "Board Key Decisions", importanceFlag: "Insightful", category: "Governance & Board Updates", subcategory: "Board Meeting Outcomes", emoji: "📃" },
          concernFlag: { flag: "📎 Procedural Update", flagNote: "Routine board meeting notice for financial results approval" },
          deepdiveData: { type: "IMPACT_ANALYSIS", fast_fact: "The company has scheduled a board meeting on May 22, 2026 to approve audited financial results for the year ending March 31, 2026, and to consider recommending a final dividend." }
        }
      },
      {
        id: "844612012360130365",
        title: "PB Fintech Limited",
        description: "💎 Block Deal · PolicyBazaar · ₹805 cr changed hands",
        content: "Tencent Cloud Europe sold 48.4L shares of PolicyBazaar on NSE at WATP ₹1,664. Buyers include Societe Generale and Morgan Stanley Asia Singapore.",
        scripDetails: { bseScripCode: "543390", scripName: "PB Fintech Limited", bseTickr: "POLICYBZR", nseTickr: "POLICYBZR", isin: "INE417T01026" },
        linkDetail: { shortLink: "https://sqst.in/aB12X", linkSource: "ScoutQuest.in" },
        creationTime: 1779200000,
        filterCategory: "KEY_UPDATE",
        proFunnel: {
          sentiment: "negative",
          bytes: [
            { tag: "Total Bought Value", data: "₹805.45 cr" },
            { tag: "WATP", data: "₹1,664" },
            { tag: "Quantity", data: "4,840,439" }
          ],
          classificationJson: { smartTag: "Block Deal", importanceFlag: "Insightful", category: "Trading Activity", subcategory: "Block Deals", emoji: "💎" },
          concernFlag: { flag: "💡 Insightful Update", flagNote: "Tencent exits at WATP indicates strategic divestiture" },
          deepdiveData: {
            type: "BLOCK_DEAL",
            date: "2026-05-08",
            dealType: "BLOCK",
            dealExchange: "NSE",
            companyName: "PB Fintech Limited",
            companySymbol: "POLICYBZR",
            buyDeals: [
              { date: "2026-05-08", side: "BUY", watp: 1664, clientName: "SOCIETE GENERALE", companyName: "PB Fintech Limited", aggregatedQty: 1076200, companySymbol: "POLICYBZR" },
              { date: "2026-05-08", side: "BUY", watp: 1664, clientName: "MORGAN STANLEY ASIA SINGAPORE PTE", companyName: "PB Fintech Limited", aggregatedQty: 2140739, companySymbol: "POLICYBZR" }
            ],
            sellDeals: [
              { date: "2026-05-08", side: "SELL", watp: 1664, clientName: "TENCENT CLOUD EUROPE B.V.", companyName: "PB Fintech Limited", aggregatedQty: 4840439, companySymbol: "POLICYBZR" }
            ],
            totalSoldQty: 4840439,
            totalBoughtQty: 4840439,
            totalSoldValue: 8054490496,
            totalBoughtValue: 8054490496,
            transactionValueInCr: "805.45 crores"
          }
        }
      },
      {
        id: "844612012360130366",
        title: "Macrotech Developers Limited",
        description: "📊 Q4 FY24 Earnings · Pre-sales up 40% YoY",
        content: "Record pre-sales: Q4 FY24 at INR 42.3 billion (40% YoY growth). FY24 EBITDA margin ~30%. Operating cash flow ₹57.2 bn for FY24.",
        scripDetails: { bseScripCode: "543287", scripName: "Macrotech Developers Limited", bseTickr: "LODHA", nseTickr: "LODHA", isin: "INE670K01029" },
        linkDetail: { shortLink: "https://sqst.in/F08qo", linkSource: "ScoutQuest.in" },
        creationTime: 1779100000,
        filterCategory: "ANALYTICAL_UPDATE",
        proFunnel: {
          sentiment: "positive",
          bytes: [
            { tag: "Q4 Pre-sales", data: "₹42.3 bn" },
            { tag: "FY24 EBITDA margin", data: "~30%" },
            { tag: "Op. Cash Flow", data: "₹57.2 bn" }
          ],
          classificationJson: { smartTag: "Quarterly Earnings", importanceFlag: "Insightful", category: "Financial Performance", subcategory: "Earnings Reports", emoji: "📊" },
          concernFlag: { flag: "💡 Insightful Update", flagNote: "Strong operating performance with margin expansion" },
          deepdiveData: { type: "IMPACT_ANALYSIS", fast_fact: "Macrotech reported record FY24 pre-sales of INR 145.2 billion (20% YoY) with EBITDA margin of ~30%." }
        }
      },
      {
        id: "844612012360130367",
        title: "Refex Industries Ltd",
        description: "📦 Business Order Received · ₹20.27 cr",
        content: "Order from a leading Miniratna Company for logistics and material handling services in the infrastructure and mining sector. Execution period ~6 months.",
        scripDetails: { bseScripCode: "532884", scripName: "Refex Industries Ltd", bseTickr: "REFEX", nseTickr: "REFEX", isin: "INE043D01016" },
        linkDetail: { shortLink: "https://sqst.in/Or6xY", linkSource: "ScoutQuest.in" },
        creationTime: 1779000000,
        filterCategory: "KEY_UPDATE",
        proFunnel: {
          sentiment: "positive",
          bytes: [
            { tag: "Order Size", data: "₹20.27 cr (inc. GST)" },
            { tag: "Execution Period", data: "~6 months" },
            { tag: "Sector", data: "Infrastructure & Mining" }
          ],
          classificationJson: { smartTag: "Business Order Win", importanceFlag: "Insightful", category: "Corporate Action", subcategory: "Order Received", emoji: "📦" },
          concernFlag: { flag: "💡 Insightful Update", flagNote: "Government Miniratna client adds revenue visibility" },
          deepdiveData: {
            type: "ORDER_RECEIVED",
            size_of_order: "INR 20.27 Crore (inclusive of GST)",
            type_of_order_flag: "business_order",
            short_description_of_order_details: "Refex Industries Ltd received an order from a leading Miniratna Company for logistics and material handling services in the infrastructure and mining sector to be executed over ~6 months."
          }
        }
      }
    ],
    currentPage: 0,
    totalItems: 9984,
    totalPages: 3328
  };

  /* ─── deepdiveData type examples ─── */
  const deepdiveSamples = {
    BLOCK_DEAL: {
      label: "Block Deal",
      desc: "Large off-market trades — buyers, sellers, weighted-average price, total value.",
      stock: "PB Fintech Limited",
      data: {
        type: "BLOCK_DEAL",
        date: "2026-05-08",
        dealType: "BLOCK",
        dealExchange: "NSE",
        companyName: "PB Fintech Limited",
        companySymbol: "POLICYBZR",
        buyDeals: [
          { date: "2026-05-08", side: "BUY", watp: 1664, clientName: "SOCIETE GENERALE", aggregatedQty: 1076200 },
          { date: "2026-05-08", side: "BUY", watp: 1664, clientName: "MORGAN STANLEY ASIA SINGAPORE PTE", aggregatedQty: 2140739 }
        ],
        sellDeals: [
          { date: "2026-05-08", side: "SELL", watp: 1664, clientName: "TENCENT CLOUD EUROPE B.V.", aggregatedQty: 4840439 }
        ],
        totalSoldQty: 4840439,
        totalBoughtQty: 4840439,
        totalSoldValue: 8054490496,
        totalBoughtValue: 8054490496,
        transactionValueInCr: "805.45 crores"
      }
    },
    BULK_DEAL: {
      label: "Bulk Deal",
      desc: "On-exchange bulk trade — single side, single client, single price.",
      stock: "Yashhtej Industries (India) Ltd",
      data: {
        type: "BULK_DEAL",
        qty: 163200,
        date: "2026-04-24",
        side: "BUY",
        price: 75.5,
        dealType: "BULK",
        clientName: "NEO APEX SHARE BROKING SERVICES LLP",
        companyName: "Yashhtej Industries (India) Li",
        dealExchange: "BSE"
      }
    },
    MANAGEMENT_TAKE: {
      label: "Management Take",
      desc: "Distilled management commentary from earnings calls and investor decks.",
      stock: "Sample Gaming Co.",
      data: {
        type: "MANAGEMENT_TAKE",
        imageUrl: "",
        audio_url: "https://scoutquest-autoexpiry-qa.s3.ap-south-1.amazonaws.com/amioXmTD.mp3",
        isAudioPresent: true,
        isImagePresent: true,
        future_outlook_essence: "<ul><li><b>Virtual Console Launch:</b> Launch planned within two weeks on Flipkart, priced under ₹5,000 with subscription.</li><li><b>Growth Target:</b> Aims for gaming MRR of USD 3M within 15–18 months.</li></ul>",
        current_performance_essence: "<ul><li><b>EBITDA Growth:</b> FY26 EBITDA surged 110.6% to ₹297M through cost optimizations.</li><li><b>Revenue Trends:</b> FY26 revenue declined 10.2% YoY to ₹5,245M.</li></ul>"
      }
    },
    RESULTS_QUICK_LOOK: {
      label: "Results Quick Look",
      desc: "Headline numbers at a glance — latest, sequential, and YoY revenue & profit.",
      stock: "Sample Industries Ltd",
      data: {
        type: "RESULTS_QUICK_LOOK",
        result_data: {
          qoq_rev: "25,850",
          yoy_rev: "24,648",
          confident: "yes",
          latest_rev: "27,589",
          amount_unit: "Lakhs",
          qoq_profits: "1,151",
          result_type: "standalone",
          yoy_profits: "1,923",
          latest_profits: "1,329",
          relevant_page_image: ""
        }
      }
    },
    IMPACT_ANALYSIS: {
      label: "Impact Analysis",
      desc: "Single-line distilled summary of corporate actions and disclosures.",
      stock: "Birla Precision Technologies Ltd",
      data: {
        type: "IMPACT_ANALYSIS",
        fast_fact: "The company approved FY26 audited financial results showing a net profit of ₹4,104.61 Lakh on ₹77,165.74 Lakh revenue. A final dividend of ₹1.50 per share was recommended and several director and auditor appointments were made. The Annual General Meeting is set for 12 August 2026."
      }
    },
    SAST_NOTEWORTHY_TRANSACTION: {
      label: "SAST Transaction",
      desc: "Substantial Acquisition of Shares and Takeovers Regulations — promoter / large-holder share movements.",
      stock: "Paisalo Digital Ltd",
      data: {
        type: "SAST_NOTEWORTHY_TRANSACTION",
        body: "➕ Pri Caf Private Limited held 2.9437% before the transaction. Buyer belongs to the promoter group.",
        acquirer: "Pri Caf Private Limited",
        quantity: 1071000,
        isPromoterRaw: "yes",
        targetCompany: "Paisalo Digital Ltd",
        shareHolderType: "PROMOTER",
        transactionType: "buy",
        percentageAcquired: 0.1178,
        percentageHoldingBeforeAcquisition: 2.9437
      }
    },
    CHART_WIZARD: {
      label: "Chart Wizard",
      desc: "Technical analysis output — pattern detection, view, and rationale.",
      stock: "Sample Equity Ltd",
      data: {
        type: "CHART_WIZARD",
        view: "bullish",
        imageUrl: "",
        interval: "1W (weekly)",
        rationale: "Weekly breakout above long-term horizontal resistance with a strong bullish candle and volume spike. Price trading above the rising trendline and the moving average while Bollinger Bands expand, indicating renewed bullish momentum and likely trend continuation.",
        chartIndicatorAndPatterns: "ascending triangle breakout,weekly bullish candle,volume spike,price above moving average,rising trendline,Bollinger Bands expansion"
      }
    },
    BROADCAST_BRIEFING: {
      label: "Broadcast Briefing",
      desc: "Distillation of live broadcast / market commentary mentions — title plus bulleted body.",
      stock: "Hindalco",
      data: {
        type: "BROADCAST_BRIEFING",
        image_url: "",
        isImagePresent: true,
        broadcast_briefings_title: "📈 Hindalco Surges 4% as Sensex Gains 118 Points, Nifty Crosses 23,650",
        broadcast_briefings_body: "<ul><li><b>Market Recovery:</b> Sensex closed 118 points higher; Nifty above 23,650.</li><li><b>Broad Market Breadth:</b> 128 F&O stocks gained vs. 85 in decline.</li><li><b>Top Gainers:</b> Hindalco (+4%), Reliance Industries (+3%), Godawari Power (+4.25%).</li></ul>"
      }
    },
    ANALYST_VIEW: {
      label: "Analyst View",
      desc: "Image-first analyst report — for visual reference.",
      stock: "Sample Equity Ltd",
      data: {
        type: "ANALYST_VIEW",
        image_url: "",
        isImagePresent: true
      }
    },
    TWEET: {
      label: "Tweet",
      desc: "Image-first tweet snapshot — broadcasts what's trending on social.",
      stock: "Sample Equity Ltd",
      data: {
        type: "TWEET",
        image_url: "",
        isImagePresent: true
      }
    },
    CREDIT_RATING: {
      label: "Credit Rating",
      desc: "Credit rating actions — current vs. previous, with short rationale.",
      stock: "Transindia Real Estate Ltd",
      data: {
        type: "CREDIT_RATING",
        current_rating_and_previous_rating: "Current: CARE A-; Previous: unknown",
        short_description_of_credit_rating_related_details: "CARE Ratings Limited assigned a 'CARE A-' rating with a Stable outlook on May 19, 2026, for Transindia Real Estate Ltd's long-term bank facilities of ₹250 crore. No prior rating disclosed in the filing."
      }
    },
    ANALYST_MEET: {
      label: "Analyst Meet",
      desc: "Scheduled investor / analyst meetings — organizer, attendees, agenda.",
      stock: "Excel Industries Limited",
      data: {
        type: "ANALYST_MEET",
        "name(s)_of_investors": "analysts, investors",
        short_description_of_the_sceduled_meeting: "Excel Industries Limited will host an earnings call on May 25, 2026, at 4:00 PM IST for analysts and investors to discuss operational and financial performance for Q4 and FY ended March 31, 2026.",
        name_of_the_meeting_organizer_and_event_type: "Excel Industries Limited, earnings call (conference call)"
      }
    },
    ACQUISITION: {
      label: "Acquisition",
      desc: "Inbound or outbound acquisition disclosures — what, who, how much.",
      stock: "Vodafone Idea Ltd",
      data: {
        type: "ACQUISITION",
        target_company: "MTK Quantum Green Energy Pvt. Ltd.",
        extent_of_acquisition: "26% paid-up equity capital",
        consideration_type_and_quantum: "Cash consideration of ₹4,33,22,500/- in one or more tranches",
        short_description_of_the_transaction: "Vodafone Idea Ltd. to acquire 26% equity stake in MTK Quantum Green Energy Pvt. Ltd., a renewable energy company, by investing ₹4.33 crore to set up captive solar and wind power plants for regulatory compliance and cost-effective energy procurement.",
        business_of_target_and_object_of_acquisition: "Renewable energy company setting up solar & wind power plants for generating and distributing captive power to comply with Electricity Act regulations and procure cost-effective renewable energy."
      }
    },
    ORDER_RECEIVED: {
      label: "Order Received",
      desc: "Business / contract orders won — size, sector, duration, client.",
      stock: "Refex Industries Ltd",
      data: {
        type: "ORDER_RECEIVED",
        size_of_order: "INR 20.27 Crore (inclusive of GST)",
        type_of_order_flag: "business_order",
        short_description_of_order_details: "Refex Industries Ltd received an order from a leading Miniratna Company for logistics and material handling services in the infrastructure and mining sector to be executed over ~6 months."
      }
    },
    GENERIC: {
      label: "Generic",
      desc: "Fallback bucket — for update sources without a dedicated schema. Treat the rest of deepdiveData as opaque JSON.",
      stock: "—",
      data: { type: "GENERIC" }
    }
  };

  /* ─── Sample assessment response ─── */
  const assessmentSample = {
    stock: "Intellect Design Arena Ltd",
    event_type: "Analyst recognition / Product validation",
    significance: "Medium",
    what_happened: "Forrester named Intellect's Purple Fabric a 'notable vendor' in its Q1 2026 AI Platforms Landscape. Purple Fabric — an AI platform targeting regulated industries with trust/governance focus — is in production at 40+ regulated financial institutions and supports decision intelligence, automation and AI accelerators.",
    why_this_matters: [
      "Third-party validation: Forrester recognition reduces vendor-selection friction for regulated financial institutions, improving Intellect's commercial credibility.",
      "Proof of production deployment: 40+ regulated FIs in production indicates product-market fit in a high-barrier sector (regulated banking/finance).",
      "Strategic differentiation: Emphasis on trust, governance and impact aligns with regulated clients' priorities and can be a sales differentiator versus generic AI platforms.",
      "Profitability/leverage potential: Platform growth can increase recurring, higher-margin software revenue over time, helping address the recent OPM decline (19% vs 21% previously).",
      "Balance-sheet support: Intangible assets of ₹843 Cr reflect prior R&D/IP investment in platforms like Purple Fabric, supporting scale-up without equivalent incremental capex per new client."
    ],
    investor_impact: {
      short_term: "Modest positive sentiment; limited immediate revenue impact — recognition may boost inquiries and pipeline but won't materially change FY revenue/earnings quickly.",
      medium_term: "Moderate upside to bookings and recurring software revenue over 1–3 years if recognition converts into new enterprise deals; could improve margin profile and ROCE if platform adoption scales.",
      long_term: "Structural benefit if Purple Fabric becomes a platform anchor: shifts revenue mix to higher-margin, sticky SaaS/AI services, supporting sustained ROE/ROCE improvement and higher valuation multiple."
    },
    risk_reward_outlook: "Moderate Positive",
    risk_reward_score: 7,
    ITI: "SSB3YW50IHRvIHVuZGVyc3RhbmQgZnVydGhlciBpbiBkZXRhaWwgYW5kIGFzayBtb3JlIHF1ZXN0aW9ucy4gVGFzazogQW5hbHlzZSB0aGUgZm9sbG93aW5nIG5ld3MgYmFzZWQgb24gdGhlIGNvbXBhbnkncyB0ZWNobm9sb2d5IHRyYW5zZm9ybWF0aW9uLCBlZmZpY2llbmN5IGltcGFjdCwgYW5udWFsIHJldmVudWUsIHByb2ZpdGFiaWxpdHksIGFuZCBtYXJrZXQgY2FwLg=="
  };

  /* ─── Webhook event payloads ─── */
  const webhookSamples = {
    created: {
      creationTimestamp: 1717247896,
      eventId: "evt_cdab7cfe-043c-4d4a-99c1-258c0a60f4b8",
      eventType: "v1.instrument_update.created",
      payload: {
        id: "584732514325722439",
        title: "Macrotech Developers Limited",
        description: "📊 Macrotech Developers Limited Earnings Conference Call Q4FY24",
        content: "- Record pre-sales: Q4 FY24 at INR 42.3 billion (40% YoY growth) and FY24 at INR 145.2 billion (20% YoY growth). - Strong EBITDA margin: ~30% for FY24 and ~31% for Q4 FY24. - Robust operating cash flow: INR 57.2 billion for FY24 and INR 20.5 billion in Q4 FY24.",
        scripDetails: { bseScripCode: "543287", scripName: "Macrotech Developers Limited", bseTickr: "LODHA", nseTickr: "LODHA", isin: "INE670K01029" },
        linkDetail: { shortLink: "https://sqst.in/F08qo", linkSource: "ScoutQuest.in" },
        creationTime: 1717247895,
        filterCategory: "ANALYTICAL_UPDATE",
        proFunnel: {
          sentiment: "positive",
          bytes: [
            { tag: "Q4 FY24 Pre-sales", data: "INR 42.3 billion" },
            { tag: "FY24 Pre-sales", data: "INR 145.2 billion" },
            { tag: "FY24 EBITDA margin", data: "~30%" },
            { tag: "Net Debt", data: "INR 30.1 billion" }
          ],
          classificationJson: { smartTag: "Quarterly Earnings Report", importanceFlag: "Insightful", category: "Financial Performance", subcategory: "Earnings Reports", emoji: "📊" },
          deepdive: {
            deep_dive_text: "🔍 Q4 FY24 highlights...",
            deep_dive_link: "https://scoutquest.blob.core.windows.net/sq-public-container/deepdive_Macrotech_2024.html",
            deep_dive_html: "<h2>🔍 Q4 FY24 highlights</h2><ul><li>Record pre-sales of INR 42.3 billion</li></ul>"
          },
          concernFlag: { flag: "💡 Insightful Update", flagNote: "Strong operating performance with margin expansion" },
          deepdiveData: { type: "IMPACT_ANALYSIS", fast_fact: "Macrotech reported record FY24 pre-sales of INR 145.2 billion (20% YoY) with EBITDA margin of ~30%." }
        }
      }
    },
    modified: {
      creationTimestamp: 1717247896,
      eventId: "evt_cdab7cfe-043c-4d4a-99c1-258c0a60f4b8",
      eventType: "v1.instrument_update.modified",
      payload: {
        id: "584732514325722439",
        title: "Macrotech Developers Limited",
        description: "📊 Macrotech Developers Limited Earnings Conference Call Q4FY24 (Revised)",
        content: "- Record pre-sales: Q4 FY24 at INR 42.3 billion (40% YoY growth) and FY24 at INR 145.2 billion (20% YoY growth). - Strong EBITDA margin: ~30% for FY24 and ~31% for Q4 FY24.",
        scripDetails: { bseScripCode: "543287", scripName: "Macrotech Developers Limited", bseTickr: "LODHA", nseTickr: "LODHA", isin: "INE670K01029" },
        linkDetail: { shortLink: "https://sqst.in/F08qo", linkSource: "ScoutQuest.in" },
        creationTime: 1717247895,
        filterCategory: "ANALYTICAL_UPDATE",
        proFunnel: {
          sentiment: "positive",
          bytes: [
            { tag: "Q4 FY24 Pre-sales", data: "INR 42.3 billion" },
            { tag: "FY24 Pre-sales", data: "INR 145.2 billion" }
          ],
          classificationJson: { smartTag: "Quarterly Earnings Report", importanceFlag: "Insightful", category: "Financial Performance", subcategory: "Earnings Reports", emoji: "📊" },
          deepdive: {
            deep_dive_text: "🔍 Q4 FY24 highlights (revised)...",
            deep_dive_link: "https://scoutquest.blob.core.windows.net/sq-public-container/deepdive_Macrotech_2024.html",
            deep_dive_html: "<h2>🔍 Q4 FY24 highlights (revised)</h2>"
          },
          concernFlag: { flag: "💡 Insightful Update", flagNote: "Strong operating performance with margin expansion" },
          deepdiveData: { type: "IMPACT_ANALYSIS", fast_fact: "Macrotech reported record FY24 pre-sales of INR 145.2 billion (20% YoY) with EBITDA margin of ~30%." }
        }
      }
    },
    assessment_ready: {
      creationTimestamp: 1717248130,
      eventId: "evt_9f1c4a7e-88d2-4c31-b0aa-2f5be1d7c904",
      eventType: "v1.assessment.ready",
      payload: {
        instrumentUpdateId: "584732514325722439",
        scripDetails: { bseScripCode: "538835", scripName: "Intellect Design Arena Ltd", bseTickr: "INTELLECT", nseTickr: "INTELLECT", isin: "INE306R01017" },
        creationTime: 1717247895,
        assessment: assessmentSample
      }
    },
    user_created: {
      creationTimestamp: 1735731297,
      eventId: "evt_16ecf03b-333d-4aab-aeff-6b1036e458af",
      eventType: "v1.user.created",
      payload: {
        countryCode: "+91",
        creationTime: 1735731295,
        messageContent: "Hello I'm a client of Broker A. I would like to subscribe to WhatsApp updates for Stocks that I track",
        messageId: "67752577f91729f7d301a793",
        mobileNo: "888888888",
        referralOrigin: "whatsapp-tellephant-bot",
        referralSource: "Broker-A",
        userId: "usr_6622575129096656",
        userSignupChannel: "WHATSAPP"
      }
    },
    user_modified: {
      creationTimestamp: 1740599471,
      eventId: "evt_5d303a23-ada3-4b38-b3ea-e23dc29ece3a",
      eventType: "v1.user.modified",
      payload: {
        consentStatus: "OPT_IN",
        countryCode: "+91",
        creationTime: 1735731295,
        lastModificationTime: 1740599471,
        mobileNo: "9999999999",
        userId: "usr_662257512909639656"
      }
    }
  };

  /* ─── Sample request bodies (deserialized) for endpoints ─── */
  const sampleResponses = {
    queryFull: {
      instrumentUpdateMessages: [querySample.instrumentUpdateMessages[0]],
      currentPage: 0,
      totalItems: 9984,
      totalPages: 3328
    },
    assessmentFull: assessmentSample
  };

  return {
    filterCategories,
    querySample,
    deepdiveSamples,
    assessmentSample,
    webhookSamples,
    sampleResponses
  };
})();
