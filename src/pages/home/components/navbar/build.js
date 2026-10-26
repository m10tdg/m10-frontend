const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, PageOrientation, PageBreak,
  Numbering, LevelFormat, convertInchesToTwip
} = require("docx");

const FONT = "Calibri";
const NAVY = "1F3864";
const LBLUE = "DCE6F1";
const GREY = "595959";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 30, font: FONT })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 24, font: FONT })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 140, line: 276 },
    children: [new TextRun({ text, font: FONT, size: 21, ...opts })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: FONT, size: 21 })],
  });
}
function note(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, italics: true, color: GREY, font: FONT, size: 19 })],
  });
}

function cell(text, { header = false, width, bold = false, color, align } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, fill: NAVY, color: "auto" } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: header || bold,
            color: header ? "FFFFFF" : (color || "000000"),
            font: FONT,
            size: 19,
          }),
        ],
      }),
    ],
  });
}

function makeTable(widths, rows) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, i) =>
      new TableRow({
        children: r.map((val, ci) =>
          cell(val, {
            width: widths[ci],
            header: i === 0,
            align: ci > 0 && i > 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          })
        ),
      })
    ),
  });
}

const TW = 9360; // usable table width (10800 - some margin buffer), used consistently below

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 260 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 260 } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children: [
        // ---------- TITLE ----------
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: "AI-Powered Automated Software Testing Platform", bold: true, size: 40, color: NAVY, font: FONT })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: "AWS Deployment & LLM Production-Serving Cost Report", bold: true, size: 28, color: GREY, font: FONT })],
        }),
        new Paragraph({
          spacing: { after: 400 },
          children: [new TextRun({ text: "Prepared September 2026 — all prices are US East (N. Virginia) on-demand list prices and are estimates for planning purposes only.", italics: true, size: 19, color: GREY, font: FONT })],
        }),

        // ---------- 1. EXECUTIVE SUMMARY ----------
        h1("1. Executive Summary"),
        p("This report answers two questions: which AWS (and non-AWS) services are needed to deploy the platform described in the project's docker-compose configuration, what each is likely to cost, and how the two LoRA fine-tuned models — Qwen2.5-14B (Scenario Agent) and DeepSeek-V2-16B (Analysis Agent) — should be served in production and at what cost."),
        p("Headline numbers (moderate production traffic, on-demand pricing, single region, no long-term commitments):"),
        bullet("Core infrastructure (compute, database, streaming, storage, networking): approximately $800 – $1,050 / month"),
        bullet("GPU inference for the two fine-tuned LLMs: approximately $1,770 – $2,720 / month, depending on instance family chosen"),
        bullet("External (non-AWS) services: approximately $0 – $100+ / month, mostly optional"),
        bullet("Estimated grand total: roughly $2,600 – $3,900 / month before reserved/savings-plan discounts"),
        note("These are on-demand, list-price estimates. Actual spend depends heavily on traffic volume, data retained, and whether 1- or 3-year Savings Plans / Reserved Instances are used (which can cut compute and GPU costs by 30–57%). Sections 5 and 8 give the full breakdown and levers for reducing this bill."),

        // ---------- 2. ARCHITECTURE RECAP ----------
        h1("2. Architecture Recap"),
        p("The docker-compose stack defines the following components, which this report maps onto AWS services:"),
        bullet("PostgreSQL — primary relational database"),
        bullet("Zookeeper + Kafka + Kafka UI — event streaming backbone between services"),
        bullet("Qdrant — vector database for RAG over uploaded project documents"),
        bullet("LocalStack — local-only S3 emulator (replaced entirely by real Amazon S3 in production; no production cost)"),
        bullet("project-service, document-service, ci-integration-service, embedding-service, orchestrator — five containerized Node.js/Python services"),
        bullet("React frontend — built separately, served as a static site"),
        bullet("Two LoRA fine-tuned LLMs (Qwen2.5-14B, DeepSeek-V2-16B) used by the Scenario Agent and Analysis Agent respectively — not present in the compose file, but required for production inference"),

        // ---------- 3. AWS SERVICES ----------
        h1("3. AWS Services Required"),
        p("The table below maps each compose component to the AWS service used to run it in production."),
        makeTable(
          [2600, 3260, 3500],
          [
            ["Compose Component", "AWS Service", "Purpose"],
            ["postgres", "Amazon RDS for PostgreSQL", "Managed, backed-up relational database (Multi-AZ recommended)"],
            ["zookeeper / kafka / kafka-ui", "Amazon MSK (Managed Streaming for Apache Kafka)", "Managed Kafka cluster; removes the ops burden of patching brokers/ZooKeeper"],
            ["qdrant", "Amazon EC2 (self-hosted) or Qdrant Cloud on AWS Marketplace", "Vector store for RAG embeddings"],
            ["localstack", "— (not deployed)", "Replaced by real S3; dev-only tool"],
            ["project-service, document-service, ci-integration-service, embedding-service, orchestrator", "Amazon ECS on Fargate", "Serverless containers for each microservice"],
            ["S3 buckets (documents, artifacts)", "Amazon S3", "Uploaded documents, screenshots, test artifacts, reports"],
            ["React frontend", "Amazon S3 + Amazon CloudFront", "Static hosting + global CDN"],
            ["Service routing", "Application Load Balancer (ALB)", "Routes traffic to ECS services"],
            ["Private subnet egress", "NAT Gateway", "Lets private-subnet services reach the internet (OpenAI API, package registries)"],
            ["Container images", "Amazon ECR", "Private Docker registry"],
            ["Secrets (DB creds, API keys)", "AWS Secrets Manager", "Secure credential storage, referenced by ECS tasks"],
            ["Logs/metrics", "Amazon CloudWatch", "Centralized logging, dashboards, alarms"],
            ["DNS / TLS", "Route 53 + AWS Certificate Manager", "Domain routing and free SSL certificates"],
            ["LLM inference (new requirement)", "Amazon EC2 GPU instances (or SageMaker)", "Hosts the fine-tuned Qwen2.5-14B and DeepSeek-V2-16B models"],
          ]
        ),

        // ---------- 4. EXTERNAL SERVICES ----------
        h1("4. External (Non-AWS) Services"),
        p("A handful of components are more naturally left outside AWS:"),
        bullet("OpenAI API — the embedding-service currently calls OPENAI_API_KEY for text embeddings. This can stay external, or be replaced later by a self-hosted embedding model to remove the dependency entirely."),
        bullet("Source-control / CI runner (GitHub Actions, GitLab CI, etc.) — the ci-integration-service most likely talks to a Git host's CI system rather than one AWS runs itself."),
        bullet("Domain registration — can be bought through Route 53 (kept in AWS) or an external registrar such as Namecheap/GoDaddy; either way the recurring cost is small."),
        bullet("Optional observability/alerting (e.g., Datadog, Sentry) — CloudWatch covers the basics; these are only needed if deeper APM or error tracking is wanted."),
        bullet("Optional: Hugging Face Hub for versioning model weights/datasets — free for public repos, paid for private storage above the free quota."),
        note("None of these are mandatory for a functioning deployment except the embedding provider (OpenAI or a self-hosted replacement) and a Git/CI host."),

        // ---------- 5. PRICING BREAKDOWN ----------
        h1("5. Detailed Pricing Breakdown"),
        p("All rates below are US East (N. Virginia) on-demand list prices as of Q3 2026. Actual AWS Pricing Calculator output should be used for final budgeting since rates vary by region and change over time."),

        h2("5.1 Compute — Amazon ECS on Fargate"),
        p("Assumes each service runs as one always-on task, sized for light-to-moderate load (right-sizing later will reduce this). Fargate bills $0.04048 per vCPU-hour and $0.004445 per GB-hour."),
        makeTable(
          [3400, 1700, 1700, 1180, 1380],
          [
            ["Service", "vCPU", "Memory", "Hrs/mo", "Est. $/mo"],
            ["project-service", "0.5", "1 GB", "730", "$18"],
            ["document-service", "0.5", "1 GB", "730", "$18"],
            ["ci-integration-service", "0.25", "0.5 GB", "730", "$9"],
            ["embedding-service", "1", "2 GB", "730", "$36"],
            ["orchestrator (LangGraph)", "1", "2 GB", "730", "$36"],
            ["kafka-ui (optional, internal)", "0.25", "0.5 GB", "730", "$9"],
            ["Subtotal — ECS Fargate", "", "", "", "≈ $126"],
          ]
        ),

        h2("5.2 Database — Amazon RDS for PostgreSQL"),
        makeTable(
          [4300, 3200, 1860],
          [
            ["Item", "Configuration", "Est. $/mo"],
            ["DB instance (Single-AZ)", "db.t4g.medium (2 vCPU / 4 GB)", "≈ $50"],
            ["DB instance (Multi-AZ, recommended for prod)", "db.t4g.medium, one standby", "≈ $100"],
            ["Storage", "100 GB gp3", "≈ $12"],
            ["Automated backups (7-day retention)", "Included up to DB size", "$0"],
            ["Subtotal — RDS", "Multi-AZ", "≈ $110 – $115"],
          ]
        ),

        h2("5.3 Event Streaming — Amazon MSK"),
        p("MSK requires a minimum of 3 brokers spread across Availability Zones for production durability."),
        makeTable(
          [4300, 3200, 1860],
          [
            ["Item", "Configuration", "Est. $/mo"],
            ["Brokers", "3 × kafka.m5.large @ $0.21/hr", "≈ $460"],
            ["Storage", "3 × 100 GB @ $0.10/GB-month", "≈ $30"],
            ["Subtotal — MSK", "3-broker cluster", "≈ $490"],
          ]
        ),
        note("MSK is the fully-managed, lowest-ops option. A self-managed Kafka + ZooKeeper cluster on 2–3 EC2 instances (e.g., m5.large) can run for roughly $150–$220/month instead, at the cost of patching, scaling, and failure recovery being your team's responsibility. Graviton brokers (kafka.m7g.large) are about 3% cheaper than m5 and are a reasonable default."),

        h2("5.4 Vector Database — Qdrant"),
        makeTable(
          [4300, 3200, 1860],
          [
            ["Item", "Configuration", "Est. $/mo"],
            ["Self-hosted on EC2 (recommended to start)", "1 × r6g.large + 100 GB gp3 EBS", "≈ $85 – $105"],
            ["Qdrant Cloud (managed, AWS Marketplace)", "~10M vectors @ 384 dims", "≈ $205"],
            ["Qdrant Cloud (larger corpus)", "~40M vectors, quantized", "≈ $34 – $546"],
          ]
        ),
        note("Since Qdrant is already run as a container in the existing compose file, self-hosting it on a single EC2 instance (behind the ECS services, not exposed publicly) is the cheapest path and keeps operations consistent with the current setup. Qdrant Cloud is a viable external alternative if the team would rather not manage backups/upgrades itself."),

        h2("5.5 Storage, CDN, Networking"),
        makeTable(
          [4300, 3200, 1860],
          [
            ["Item", "Configuration", "Est. $/mo"],
            ["Amazon S3 (documents + artifacts + frontend build)", "~250 GB Standard + requests", "≈ $10 – $20"],
            ["Amazon CloudFront (frontend CDN)", "First 10 TB tier @ $0.085/GB, low-moderate traffic", "≈ $5 – $15"],
            ["Application Load Balancer", "1 ALB, base + LCU usage", "≈ $20 – $30"],
            ["NAT Gateway", "1 gateway, base $0.045/hr + $0.045/GB processed", "≈ $35 – $70"],
            ["Amazon ECR", "Image storage for 5 services", "≈ $2 – $5"],
            ["AWS Secrets Manager", "~6 secrets @ $0.40/secret/mo", "≈ $3"],
            ["Amazon CloudWatch", "Logs, metrics, a handful of alarms/dashboards", "≈ $10 – $25"],
            ["Route 53 + ACM", "Hosted zone + queries; TLS certs are free", "≈ $1 – $2 (+ ~$12/yr domain)"],
          ]
        ),

        h2("5.6 Core Infrastructure Subtotal"),
        makeTable(
          [6300, 3060],
          [
            ["Category", "Est. $/mo"],
            ["ECS Fargate (5–6 services)", "$126"],
            ["RDS PostgreSQL (Multi-AZ)", "$110"],
            ["Amazon MSK (Kafka)", "$490"],
            ["Qdrant (self-hosted EC2)", "$95"],
            ["S3 + CloudFront", "$25"],
            ["ALB + NAT Gateway", "$75"],
            ["ECR + Secrets Manager + CloudWatch + Route 53", "$30"],
            ["Core infrastructure total", "≈ $950 / month"],
          ]
        ),
        note("Kafka is the single largest non-GPU line item. If message volume is genuinely light, a self-managed Kafka cluster or even Amazon Kinesis Data Streams (pay-per-shard, no minimum broker count) could bring this section closer to $600–$700/month."),

        // ---------- 6. LLM SECTION ----------
        h1("6. Serving the Fine-Tuned LLMs in Production"),
        p("Qwen2.5-14B (Scenario Agent) and DeepSeek-V2-16B (Analysis Agent) are both fine-tuned with LoRA adapters, which keeps the adapters themselves small (tens to hundreds of MB) — the cost driver is hosting the base model weights, not the adapter."),

        h2("6.1 What \"running them as fine-tuned\" means in practice"),
        bullet("Store the base model weights once (Qwen2.5-14B and DeepSeek-V2-16B) plus the trained LoRA adapter for each."),
        bullet("Serve with an inference engine that supports LoRA adapters natively — vLLM and TGI (Text Generation Inference) both support loading one or more LoRA adapters on top of a base model at request time, so the adapter does not need to be merged into the weights."),
        bullet("Each model needs its own GPU-backed endpoint, since Qwen2.5 and DeepSeek-V2 are different base architectures and cannot share one deployment."),
        bullet("Quantization (AWQ/GPTQ INT4, or INT8) reduces the GPU memory needed and therefore the instance size required, at some cost to throughput/quality."),

        h2("6.2 Deployment options compared"),
        makeTable(
          [2200, 2500, 2360, 2300],
          [
            ["Option", "How it works", "Pros", "Cons"],
            ["Self-hosted EC2 + vLLM (recommended)", "One GPU EC2 instance per model, running vLLM with the LoRA adapter loaded", "Full control, lowest cost per token at steady load, supports multi-LoRA if more adapters are added later", "You manage scaling, health checks, and upgrades yourself"],
            ["Amazon SageMaker real-time endpoints", "Same GPU instance types, but AWS manages the endpoint, autoscaling, and model registry", "Less operational overhead, built-in monitoring/versioning", "Typically 10-20% pricier than raw EC2 for the same instance; less flexibility for custom serving code"],
            ["Amazon Bedrock", "Fully managed, serverless model hosting", "No infrastructure to manage at all", "Bedrock does not currently offer native hosting for arbitrary open-weight fine-tunes of Qwen2.5-14B or DeepSeek-V2-16B; its Custom Model Import feature only supports a limited set of architectures, so this option should be re-verified against AWS's current supported-model list before relying on it"],
          ]
        ),

        h2("6.3 Sizing the GPUs"),
        p("Qwen2.5-14B and DeepSeek-V2-16B each need roughly 28–32 GB of GPU memory to run in bf16/fp16 with a comfortable KV-cache/batch headroom, or roughly 14–16 GB with INT8 quantization."),
        makeTable(
          [2600, 2500, 2200, 2060],
          [
            ["Instance", "GPU", "On-demand $/hr", "Est. $/mo (24/7)"],
            ["g5.2xlarge (INT8-quantized, single model)", "1 × A10G, 24 GB", "$1.212", "≈ $885"],
            ["g6e.xlarge (fp16, single model, recommended)", "1 × L40S, 48 GB", "$1.861", "≈ $1,359"],
            ["g6e.2xlarge (fp16, more headroom/throughput)", "1 × L40S, 64 GB RAM", "$2.242", "≈ $1,637"],
          ]
        ),

        h2("6.4 Recommended configuration & cost"),
        p("Run each fine-tuned model on its own g6e.xlarge instance (1× NVIDIA L40S, 48 GB VRAM) with vLLM and the model's LoRA adapter loaded — this gives full-precision quality with room for concurrent requests, without needing multi-GPU orchestration."),
        makeTable(
          [4300, 3200, 1860],
          [
            ["Item", "Configuration", "Est. $/mo"],
            ["Qwen2.5-14B endpoint (Scenario Agent)", "1 × g6e.xlarge, on-demand, 24/7", "$1,359"],
            ["DeepSeek-V2-16B endpoint (Analysis Agent)", "1 × g6e.xlarge, on-demand, 24/7", "$1,359"],
            ["LLM hosting subtotal (on-demand)", "2 instances, always-on", "≈ $2,718"],
            ["Same, with 1-yr No-Upfront Savings Plan (≈24% off)", "2 instances", "≈ $2,054"],
            ["Cost-optimized alternative: 2 × g5.2xlarge, INT8", "1 × A10G each, quantized", "≈ $1,770 on-demand"],
          ]
        ),
        note("If the Scenario and Analysis agents are not called around the clock (e.g., testing runs happen in bursts during business hours or CI triggers), the GPU instances can be scaled to zero outside those windows using a scheduled Auto Scaling group or SageMaker's scale-to-zero endpoints, which would cut this line item substantially — potentially by 50-70% for a typical 9-hour weekday usage pattern."),

        // ---------- 7. GRAND TOTAL ----------
        h1("7. Grand Total Monthly Cost Estimate"),
        makeTable(
          [6300, 3060],
          [
            ["Category", "Est. $/mo"],
            ["Core AWS infrastructure (Section 5.6)", "≈ $950"],
            ["GPU-hosted LLM inference, on-demand (Section 6.4, fp16 option)", "≈ $2,718"],
            ["External services (OpenAI embeddings, optional CI minutes, etc.)", "≈ $0 – $100"],
            ["Estimated grand total (on-demand, no commitments)", "≈ $3,670 – $3,770 / month"],
            ["With 1-yr Savings Plans on Fargate + GPU instances", "≈ $2,700 – $2,900 / month"],
            ["With INT8-quantized LLM hosting instead of fp16", "≈ $2,700 – $2,850 / month"],
          ]
        ),
        note("These figures exclude one-time engineering time, data-transfer overages beyond the assumptions above, and any AWS support plan (Business support starts at $100/month or 3% of usage, whichever is greater)."),

        // ---------- 8. COST OPTIMIZATION ----------
        h1("8. Cost Optimization Levers"),
        bullet("Commit to a 1-year Compute Savings Plan once traffic is stable — saves 20-24% on Fargate and GPU compute with no loss of flexibility."),
        bullet("Scale GPU inference instances down/off outside business hours if test runs are not needed 24/7 — the single biggest lever given LLM hosting is over 70% of the bill."),
        bullet("Re-evaluate Amazon MSK vs. self-managed Kafka on EC2 or Amazon Kinesis once real throughput is known — MSK's 3-broker minimum makes it costly for light event volume."),
        bullet("Use S3 Intelligent-Tiering for older test artifacts and screenshots that are rarely re-accessed."),
        bullet("Add VPC Gateway Endpoints for S3 (free) to cut NAT Gateway data-processing charges for S3 traffic."),
        bullet("Quantize the fine-tuned models (AWQ/GPTQ INT4/INT8) if quality holds up in evaluation — this can roughly halve the GPU instance size needed."),

        // ---------- 9. ASSUMPTIONS ----------
        h1("9. Assumptions & Caveats"),
        bullet("Region: US East (N. Virginia); other regions typically run 10-30% higher."),
        bullet("\"Moderate production traffic\" is assumed since no specific request volume, document-upload volume, or concurrent-test-run count was provided; all compute sizing should be revisited with real load-testing data."),
        bullet("Prices reflect AWS on-demand list prices current as of Q3 2026 and will drift over time — the AWS Pricing Calculator should be used for a final, region- and commitment-specific quote before budgeting."),
        bullet("Data-transfer/egress costs beyond the CloudFront and NAT Gateway line items (e.g., large model weight downloads, high-volume screenshot storage) are not separately itemized and could add a meaningful amount at scale."),
        bullet("Amazon Bedrock's Custom Model Import support for specific base architectures changes over time and should be re-checked directly against AWS documentation before ruling it in or out."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync("/mnt/user-data/outputs/AWS_Deployment_Cost_Report.docx", buf);
  console.log("done");
});