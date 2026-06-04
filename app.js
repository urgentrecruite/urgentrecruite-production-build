const CONFIG = {
  profileEndpoint: "",
  shortlistEndpoint: "",
  contactEndpoint: "",
  adminUrl: "../index.html"
};

const formDialog = document.querySelector("#form-dialog");
const applicationForm = document.querySelector("#application-form");
const candidateFields = document.querySelector("#candidate-fields");
const shortlistFields = document.querySelector("#shortlist-fields");
const sourceInput = document.querySelector("#submission-source");
const formTitle = document.querySelector("#form-title");
const formDescription = document.querySelector("#form-description");
const formEyebrow = document.querySelector("#form-eyebrow");
const salaryField = document.querySelector("#salary-field");
const summaryLabel = document.querySelector("#summary-label");
const summaryTextarea = document.querySelector("#summary-textarea");
const submitButton = document.querySelector("#submit-form");
const menuButton = document.querySelector("#menu-button");
const siteHeader = document.querySelector(".site-header");
const generateBriefButton = document.querySelector("#generate-brief");
const generatedBrief = document.querySelector("#generated-brief");
const toast = document.querySelector("#toast");
const previousStepButton = document.querySelector("#previous-step");
const nextStepButton = document.querySelector("#next-step");
const formProgress = document.querySelector("#form-progress");
const countryInput = document.querySelector("#country-input");
const phoneInput = document.querySelector("#phone-input");
const summaryWordCount = document.querySelector("#summary-word-count");
const languageSelect = document.querySelector("#language-select");
const candidateCurrencyCode = document.querySelector("#candidate-currency-code");
const candidateSalaryInput = document.querySelector("#candidate-salary-input");
const requestCurrencyCode = document.querySelector("#request-currency-code");
const requestPayInput = document.querySelector("#request-pay-input");

let currentFormStep = 1;
let currentFormType = "cv";
let currentLanguage = "en";

const countries = [
  { name: "Nigeria", dialCode: "+234", currency: "NGN", symbol: "₦", locale: "en-NG" },
  { name: "Spain", dialCode: "+34", currency: "EUR", symbol: "€", locale: "es-ES" },
  { name: "Portugal", dialCode: "+351", currency: "EUR", symbol: "€", locale: "pt-PT" },
  { name: "Germany", dialCode: "+49", currency: "EUR", symbol: "€", locale: "de-DE" },
  { name: "Kenya", dialCode: "+254", currency: "KES", symbol: "KSh", locale: "en-KE" },
  { name: "United States", dialCode: "+1", currency: "USD", symbol: "$", locale: "en-US" },
  { name: "United Kingdom", dialCode: "+44", currency: "GBP", symbol: "£", locale: "en-GB" },
  { name: "Canada", dialCode: "+1", currency: "CAD", symbol: "$", locale: "en-CA" },
  { name: "Ghana", dialCode: "+233", currency: "GHS", symbol: "GH₵", locale: "en-GH" },
  { name: "South Africa", dialCode: "+27", currency: "ZAR", symbol: "R", locale: "en-ZA" },
  { name: "Ireland", dialCode: "+353", currency: "EUR", symbol: "€", locale: "en-IE" },
  { name: "France", dialCode: "+33", currency: "EUR", symbol: "€", locale: "fr-FR" },
  { name: "Netherlands", dialCode: "+31", currency: "EUR", symbol: "€", locale: "nl-NL" },
  { name: "Italy", dialCode: "+39", currency: "EUR", symbol: "€", locale: "it-IT" },
  { name: "United Arab Emirates", dialCode: "+971", currency: "AED", symbol: "AED", locale: "en-AE" }
];

const experienceFields = [
  "Accounting and Finance",
  "Administration",
  "Agriculture",
  "Architecture",
  "Business Development",
  "Customer Success",
  "Data Analysis",
  "Digital Marketing",
  "Education",
  "Engineering",
  "Executive Leadership",
  "Healthcare",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Logistics and Supply Chain",
  "Operations",
  "Product Management",
  "Project Management",
  "Sales",
  "Software Engineering"
];

const experienceYears = [
  "Internship / entry level",
  "1+ years",
  "2+ years",
  "3+ years",
  "5+ years",
  "7+ years",
  "10+ years",
  "15+ years"
];

const industries = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Education",
  "Energy",
  "Logistics",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Legal",
  "Public Sector",
  "Non-profit",
  "Media and Creative",
  "Real Estate",
  "Professional Services"
];

const formCopy = {
  cv: {
    eyebrow: "Candidate profile",
    title: "Submit My CV",
    description: "Tell us about yourself so we can get your profile in front of the right organizations.",
    button: "Submit Profile"
  },
  intent: {
    eyebrow: "Internship application",
    title: "I want to Intern",
    description: "Share your background and preferred department so we can match you with internship opportunities.",
    button: "Submit Internship Profile"
  },
  shortlist: {
    eyebrow: "Hiring request",
    title: "Request a Shortlist",
    description: "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.",
    button: "Submit Hiring Request"
  }
};

const translations = {
  de: {
    "How it works": "So funktioniert es",
    "Pricing": "Preise",
    "About": "Uber uns",
    "FAQ": "FAQ",
    "Contact": "Kontakt",
    "Submit My CV": "Lebenslauf einreichen",
    "I want to Intern": "Ich mochte ein Praktikum",
    "Request Shortlist": "Shortlist anfordern",
    "Menu": "Menu",
    "Close menu": "Menu schliessen",
    "Open menu": "Menu offnen",
    "Language": "Sprache",
    "Quality. Discretion. Speed.": "Qualitat. Diskretion. Geschwindigkeit.",
    "From vacancy to verified shortlist in record time.": "Von der offenen Stelle zur gepruften Shortlist in Rekordzeit.",
    "UrgentRecruite helps organizations review anonymous, pre-vetted candidate profiles before choosing who to unlock and interview.": "UrgentRecruite hilft Unternehmen, anonyme und vorgeprufte Kandidatenprofile zu sichten, bevor sie entscheiden, wen sie freischalten und interviewen.",
    "Request a Shortlist": "Shortlist anfordern",
    "Average shortlist delivery": "Durchschnittliche Shortlist-Lieferung",
    "Industries served worldwide": "Branchen weltweit",
    "Pay per profile unlocked": "Zahlung pro freigeschaltetem Profil",
    "Trusted by forward-thinking organizations": "Vertraut von zukunftsorientierten Unternehmen",
    "Our process": "Unser Prozess",
    "A simple, low-risk journey": "Ein einfacher Weg mit geringem Risiko",
    "We build structured talent pipelines around your exact needs so you spend time hiring, not filtering.": "Wir bauen strukturierte Talentpipelines nach Ihrem Bedarf, damit Sie Zeit mit Einstellen statt Filtern verbringen.",
    "Share your vacancy": "Teilen Sie Ihre Vakanz",
    "Tell us the role, seniority, industry, and key requirements.": "Nennen Sie uns Rolle, Senioritat, Branche und zentrale Anforderungen.",
    "We source and screen": "Wir suchen und prufen",
    "Our recruiters review skills, culture fit, readiness, and experience.": "Unsere Recruiter prufen Kompetenzen, Kulturfit, Verfugbarkeit und Erfahrung.",
    "Receive anonymous profiles": "Anonyme Profile erhalten",
    "Review curated candidates without seeing private contact details.": "Prufen Sie kuratierte Kandidaten, ohne private Kontaktdaten zu sehen.",
    "Unlock and interview": "Freischalten und interviewen",
    "Pay only for the profiles you choose to unlock.": "Zahlen Sie nur fur Profile, die Sie freischalten mochten.",
    "Pay only for the talent you want.": "Zahlen Sie nur fur Talente, die Sie wirklich wollen.",
    "No retainers. No traditional placement percentages. Browse pre-vetted shortlists anonymously and unlock only the profiles you want to interview.": "Keine Retainer. Keine klassischen Vermittlungsprozente. Prufen Sie vorgeprufte Shortlists anonym und schalten Sie nur Profile frei, die Sie interviewen mochten.",
    "Per profile unlocked": "Pro freigeschaltetem Profil",
    "Download full profile and contact details only when you choose to proceed.": "Laden Sie vollstandige Profile und Kontaktdaten erst herunter, wenn Sie fortfahren mochten.",
    "No upfront fees": "Keine Vorausgebuhren",
    "Unlimited shortlist reviews": "Unbegrenzte Shortlist-Prufungen",
    "Pre-screened candidates": "Vorgeprufte Kandidaten",
    "About us": "Uber uns",
    "Built on trust, driven by results.": "Auf Vertrauen gebaut, auf Ergebnisse ausgerichtet.",
    "UrgentRecruite was created to solve the transparency and speed problem in traditional recruitment. We protect the privacy of both organizations and candidates while making high-quality shortlists easier to review.": "UrgentRecruite wurde geschaffen, um Transparenz und Geschwindigkeit im Recruiting zu verbessern. Wir schutzen die Privatsphare von Unternehmen und Kandidaten und machen hochwertige Shortlists einfacher prufbar.",
    "Unwavering quality": "Konsequente Qualitat",
    "Every candidate is reviewed before they reach your shortlist.": "Jeder Kandidat wird gepruft, bevor er Ihre Shortlist erreicht.",
    "Total discretion": "Volle Diskretion",
    "Anonymous profile previews protect talent and reduce bias.": "Anonyme Profilvorschauen schutzen Talente und reduzieren Voreingenommenheit.",
    "Market-leading speed": "Marktfuhrende Geschwindigkeit",
    "Most organizations receive curated shortlists in under 14 days.": "Die meisten Unternehmen erhalten kuratierte Shortlists in weniger als 14 Tagen.",
    "Get started": "Loslegen",
    "Choose the right path": "Wahlen Sie den passenden Weg",
    "The same backend can send each submission into your admin dashboard with the correct source flag.": "Das gleiche Backend sendet jede Einreichung mit der richtigen Kennzeichnung in Ihr Admin-Dashboard.",
    "Organizations": "Unternehmen",
    "Request a shortlist for an open role and receive a curated candidate pipeline.": "Fordern Sie fur eine offene Rolle eine Shortlist an und erhalten Sie eine kuratierte Kandidatenpipeline.",
    "Candidates": "Kandidaten",
    "Submit your CV so your profile can be considered for suitable roles.": "Reichen Sie Ihren Lebenslauf ein, damit Ihr Profil fur passende Rollen berucksichtigt werden kann.",
    "Interns": "Praktikanten",
    "Tell us your preferred department or field and join the global intern programme.": "Nennen Sie uns Ihren bevorzugten Bereich und treten Sie dem globalen Praktikumsprogramm bei.",
    "Support": "Support",
    "Frequently asked questions": "Haufige Fragen",
    "How does the shortlist process work?": "Wie funktioniert der Shortlist-Prozess?",
    "We source, screen, and deliver a curated list of 3-5 pre-vetted candidates that can be reviewed anonymously.": "Wir suchen, prufen und liefern eine kuratierte Liste von 3-5 vorgepruften Kandidaten, die anonym gepruft werden konnen.",
    "How are candidates screened?": "Wie werden Kandidaten gepruft?",
    "Our recruiters review technical fit, cultural fit, credentials, readiness, and role expectations.": "Unsere Recruiter prufen fachliche Passung, kulturelle Passung, Nachweise, Verfugbarkeit und Rollenerwartungen.",
    "Are we obligated to hire?": "Sind wir zur Einstellung verpflichtet?",
    "No. You only pay to unlock profiles you actually want to interview.": "Nein. Sie zahlen nur, um Profile freizuschalten, die Sie wirklich interviewen mochten.",
    "Which industries do you support?": "Welche Branchen unterstutzen Sie?",
    "We support more than 40 industries, including tech, finance, healthcare, legal, creative, operations, and leadership roles.": "Wir unterstutzen mehr als 40 Branchen, darunter Technologie, Finanzen, Gesundheitswesen, Recht, Kreativwirtschaft, Operations und Fuhrungsrollen.",
    "Contact us": "Kontaktieren Sie uns",
    "Let's start a conversation.": "Lassen Sie uns sprechen.",
    "Whether you are hiring or looking for a career-defining role, our team is here to help.": "Ob Sie einstellen oder eine karrierepragende Rolle suchen, unser Team hilft Ihnen gerne.",
    "Request Callback": "Ruckruf anfordern",
    "The right people, exactly when you need them.": "Die richtigen Menschen, genau dann, wenn Sie sie brauchen.",
    "UrgentRecruite helps organizations receive vetted anonymous shortlists, while helping candidates and interns find roles that match their experience and ambition.": "UrgentRecruite hilft Unternehmen, geprufte anonyme Shortlists zu erhalten, und hilft Kandidaten sowie Praktikanten, passende Rollen zu finden.",
    "Services": "Services",
    "Anonymous candidate shortlists": "Anonyme Kandidaten-Shortlists",
    "CV and profile screening": "CV- und Profilprufung",
    "Internship matching": "Praktikumsvermittlung",
    "Pay-per-profile unlocks": "Freischaltung pro Profil",
    "Explore": "Entdecken",
    "Platform": "Plattform",
    "About Us": "Uber uns",
    "Major market areas": "Wichtige Marktgebiete",
    "Accessible worldwide, with focused support in these markets.": "Weltweit erreichbar, mit fokussiertem Support in diesen Markten.",
    "100% Data Protection Compliant": "100% datenschutzkonform",
    "Connect": "Verbinden",
    "Let us meet you": "Lernen wir Sie kennen",
    "Your career interests": "Ihre Karriereinteressen",
    "Your internship interest": "Ihr Praktikumsinteresse",
    "Let us have your CV": "Senden Sie uns Ihren Lebenslauf",
    "Organization details": "Unternehmensdetails",
    "Role requirements": "Rollenanforderungen",
    "Share the brief": "Briefing teilen"
  },
  es: {
    "How it works": "Como funciona",
    "Pricing": "Precios",
    "About": "Sobre nosotros",
    "FAQ": "FAQ",
    "Contact": "Contacto",
    "Submit My CV": "Enviar mi CV",
    "I want to Intern": "Quiero hacer practicas",
    "Request Shortlist": "Solicitar shortlist",
    "Menu": "Menu",
    "Close menu": "Cerrar menu",
    "Open menu": "Abrir menu",
    "Language": "Idioma",
    "Quality. Discretion. Speed.": "Calidad. Discrecion. Rapidez.",
    "From vacancy to verified shortlist in record time.": "De vacante a shortlist verificada en tiempo record.",
    "UrgentRecruite helps organizations review anonymous, pre-vetted candidate profiles before choosing who to unlock and interview.": "UrgentRecruite ayuda a las organizaciones a revisar perfiles anonimos y preevaluados antes de decidir a quien desbloquear y entrevistar.",
    "Request a Shortlist": "Solicitar shortlist",
    "Average shortlist delivery": "Entrega media de shortlist",
    "Industries served worldwide": "Industrias atendidas globalmente",
    "Pay per profile unlocked": "Pago por perfil desbloqueado",
    "Trusted by forward-thinking organizations": "Elegido por organizaciones innovadoras",
    "Our process": "Nuestro proceso",
    "A simple, low-risk journey": "Un proceso sencillo y de bajo riesgo",
    "We build structured talent pipelines around your exact needs so you spend time hiring, not filtering.": "Creamos pipelines de talento segun sus necesidades para que dedique tiempo a contratar, no a filtrar.",
    "Share your vacancy": "Comparta su vacante",
    "Tell us the role, seniority, industry, and key requirements.": "Indiquenos el puesto, seniority, sector y requisitos clave.",
    "We source and screen": "Buscamos y evaluamos",
    "Our recruiters review skills, culture fit, readiness, and experience.": "Nuestros reclutadores revisan habilidades, encaje cultural, disponibilidad y experiencia.",
    "Receive anonymous profiles": "Reciba perfiles anonimos",
    "Review curated candidates without seeing private contact details.": "Revise candidatos seleccionados sin ver datos privados de contacto.",
    "Unlock and interview": "Desbloquee y entreviste",
    "Pay only for the profiles you choose to unlock.": "Pague solo por los perfiles que decida desbloquear.",
    "Pay only for the talent you want.": "Pague solo por el talento que quiere.",
    "No retainers. No traditional placement percentages. Browse pre-vetted shortlists anonymously and unlock only the profiles you want to interview.": "Sin anticipos. Sin porcentajes tradicionales. Revise shortlists preevaluadas de forma anonima y desbloquee solo los perfiles que quiera entrevistar.",
    "Per profile unlocked": "Por perfil desbloqueado",
    "Download full profile and contact details only when you choose to proceed.": "Descargue el perfil completo y los datos de contacto solo cuando decida avanzar.",
    "No upfront fees": "Sin pagos iniciales",
    "Unlimited shortlist reviews": "Revisiones ilimitadas",
    "Pre-screened candidates": "Candidatos preevaluados",
    "About us": "Sobre nosotros",
    "Built on trust, driven by results.": "Basado en confianza, orientado a resultados.",
    "UrgentRecruite was created to solve the transparency and speed problem in traditional recruitment. We protect the privacy of both organizations and candidates while making high-quality shortlists easier to review.": "UrgentRecruite nacio para resolver la falta de transparencia y velocidad en el reclutamiento tradicional. Protegemos la privacidad de organizaciones y candidatos mientras facilitamos la revision de shortlists de calidad.",
    "Unwavering quality": "Calidad constante",
    "Every candidate is reviewed before they reach your shortlist.": "Cada candidato se revisa antes de llegar a su shortlist.",
    "Total discretion": "Discrecion total",
    "Anonymous profile previews protect talent and reduce bias.": "Las vistas anonimas protegen al talento y reducen sesgos.",
    "Market-leading speed": "Rapidez lider",
    "Most organizations receive curated shortlists in under 14 days.": "La mayoria de organizaciones reciben shortlists en menos de 14 dias.",
    "Get started": "Empezar",
    "Choose the right path": "Elija el camino correcto",
    "The same backend can send each submission into your admin dashboard with the correct source flag.": "El mismo backend envia cada solicitud al panel de administracion con la marca correcta.",
    "Organizations": "Organizaciones",
    "Request a shortlist for an open role and receive a curated candidate pipeline.": "Solicite una shortlist para una vacante y reciba un pipeline de candidatos seleccionado.",
    "Candidates": "Candidatos",
    "Submit your CV so your profile can be considered for suitable roles.": "Envia tu CV para que tu perfil pueda considerarse para roles adecuados.",
    "Interns": "Practicantes",
    "Tell us your preferred department or field and join the global intern programme.": "Indiquenos su departamento o area preferida y unase al programa global de practicas.",
    "Support": "Soporte",
    "Frequently asked questions": "Preguntas frecuentes",
    "How does the shortlist process work?": "Como funciona el proceso de shortlist?",
    "We source, screen, and deliver a curated list of 3-5 pre-vetted candidates that can be reviewed anonymously.": "Buscamos, evaluamos y entregamos una lista de 3-5 candidatos preevaluados que se pueden revisar de forma anonima.",
    "How are candidates screened?": "Como se evalua a los candidatos?",
    "Our recruiters review technical fit, cultural fit, credentials, readiness, and role expectations.": "Nuestros reclutadores revisan encaje tecnico, cultural, credenciales, disponibilidad y expectativas.",
    "Are we obligated to hire?": "Estamos obligados a contratar?",
    "No. You only pay to unlock profiles you actually want to interview.": "No. Solo paga por desbloquear los perfiles que realmente quiere entrevistar.",
    "Which industries do you support?": "Que sectores cubren?",
    "We support more than 40 industries, including tech, finance, healthcare, legal, creative, operations, and leadership roles.": "Cubrimos mas de 40 sectores, incluyendo tecnologia, finanzas, salud, legal, creativo, operaciones y liderazgo.",
    "Contact us": "Contactenos",
    "Let's start a conversation.": "Empecemos una conversacion.",
    "Whether you are hiring or looking for a career-defining role, our team is here to help.": "Si esta contratando o buscando una oportunidad clave, nuestro equipo puede ayudar.",
    "Request Callback": "Solicitar llamada",
    "The right people, exactly when you need them.": "Las personas adecuadas, justo cuando las necesitas.",
    "UrgentRecruite helps organizations receive vetted anonymous shortlists, while helping candidates and interns find roles that match their experience and ambition.": "UrgentRecruite ayuda a las organizaciones a recibir shortlists anonimas verificadas, y ayuda a candidatos y practicantes a encontrar roles alineados con su experiencia y ambicion.",
    "Services": "Servicios",
    "Anonymous candidate shortlists": "Shortlists anonimas de candidatos",
    "CV and profile screening": "Revision de CV y perfiles",
    "Internship matching": "Matching de practicas",
    "Pay-per-profile unlocks": "Desbloqueo por perfil",
    "Explore": "Explorar",
    "Platform": "Plataforma",
    "About Us": "Sobre nosotros",
    "Major market areas": "Principales mercados",
    "Accessible worldwide, with focused support in these markets.": "Accesible a nivel mundial, con soporte enfocado en estos mercados.",
    "100% Data Protection Compliant": "100% conforme con proteccion de datos",
    "Connect": "Conectar",
    "Let us meet you": "Queremos conocerte",
    "Your career interests": "Tus intereses profesionales",
    "Your internship interest": "Tu interes de practicas",
    "Let us have your CV": "Compartenos tu CV",
    "Organization details": "Datos de la organizacion",
    "Role requirements": "Requisitos del rol",
    "Share the brief": "Comparte el brief"
  },
  pt: {
    "How it works": "Como funciona",
    "Pricing": "Precos",
    "About": "Sobre",
    "FAQ": "FAQ",
    "Contact": "Contacto",
    "Submit My CV": "Enviar o meu CV",
    "I want to Intern": "Quero estagiar",
    "Request Shortlist": "Pedir shortlist",
    "Menu": "Menu",
    "Close menu": "Fechar menu",
    "Open menu": "Abrir menu",
    "Language": "Idioma",
    "Quality. Discretion. Speed.": "Qualidade. Discricao. Rapidez.",
    "From vacancy to verified shortlist in record time.": "Da vaga a uma shortlist verificada em tempo recorde.",
    "UrgentRecruite helps organizations review anonymous, pre-vetted candidate profiles before choosing who to unlock and interview.": "A UrgentRecruite ajuda organizacoes a rever perfis anonimos e pre-avaliados antes de escolher quem desbloquear e entrevistar.",
    "Request a Shortlist": "Pedir shortlist",
    "Average shortlist delivery": "Entrega media da shortlist",
    "Industries served worldwide": "Industrias atendidas globalmente",
    "Pay per profile unlocked": "Pagamento por perfil desbloqueado",
    "Trusted by forward-thinking organizations": "Confiada por organizacoes inovadoras",
    "Our process": "O nosso processo",
    "A simple, low-risk journey": "Um percurso simples e de baixo risco",
    "We build structured talent pipelines around your exact needs so you spend time hiring, not filtering.": "Criamos pipelines de talento de acordo com as suas necessidades para que passe tempo a contratar, nao a filtrar.",
    "Share your vacancy": "Partilhe a sua vaga",
    "Tell us the role, seniority, industry, and key requirements.": "Indique a funcao, senioridade, setor e requisitos principais.",
    "We source and screen": "Procuramos e avaliamos",
    "Our recruiters review skills, culture fit, readiness, and experience.": "Os nossos recrutadores analisam competencias, enquadramento cultural, disponibilidade e experiencia.",
    "Receive anonymous profiles": "Receba perfis anonimos",
    "Review curated candidates without seeing private contact details.": "Reveja candidatos selecionados sem ver dados privados de contacto.",
    "Unlock and interview": "Desbloqueie e entreviste",
    "Pay only for the profiles you choose to unlock.": "Pague apenas pelos perfis que decidir desbloquear.",
    "Pay only for the talent you want.": "Pague apenas pelo talento que quer.",
    "No retainers. No traditional placement percentages. Browse pre-vetted shortlists anonymously and unlock only the profiles you want to interview.": "Sem retentores. Sem percentagens tradicionais. Consulte shortlists pre-avaliadas de forma anonima e desbloqueie apenas os perfis que quer entrevistar.",
    "Per profile unlocked": "Por perfil desbloqueado",
    "Download full profile and contact details only when you choose to proceed.": "Descarregue o perfil completo e contactos apenas quando decidir avancar.",
    "No upfront fees": "Sem custos iniciais",
    "Unlimited shortlist reviews": "Revisoes ilimitadas",
    "Pre-screened candidates": "Candidatos pre-avaliados",
    "About us": "Sobre nos",
    "Built on trust, driven by results.": "Baseado em confianca, orientado por resultados.",
    "UrgentRecruite was created to solve the transparency and speed problem in traditional recruitment. We protect the privacy of both organizations and candidates while making high-quality shortlists easier to review.": "A UrgentRecruite foi criada para resolver problemas de transparencia e rapidez no recrutamento tradicional. Protegemos a privacidade de organizacoes e candidatos enquanto facilitamos a revisao de shortlists de qualidade.",
    "Unwavering quality": "Qualidade constante",
    "Every candidate is reviewed before they reach your shortlist.": "Cada candidato e revisto antes de chegar a sua shortlist.",
    "Total discretion": "Discricao total",
    "Anonymous profile previews protect talent and reduce bias.": "Pre-visualizacoes anonimas protegem o talento e reduzem vieses.",
    "Market-leading speed": "Rapidez lider de mercado",
    "Most organizations receive curated shortlists in under 14 days.": "A maioria das organizacoes recebe shortlists em menos de 14 dias.",
    "Get started": "Comecar",
    "Choose the right path": "Escolha o caminho certo",
    "The same backend can send each submission into your admin dashboard with the correct source flag.": "O mesmo backend envia cada submissao para o painel admin com a origem correta.",
    "Organizations": "Organizacoes",
    "Request a shortlist for an open role and receive a curated candidate pipeline.": "Peca uma shortlist para uma vaga e receba um pipeline de candidatos selecionado.",
    "Candidates": "Candidatos",
    "Submit your CV so your profile can be considered for suitable roles.": "Envie o seu CV para que o seu perfil seja considerado para funcoes adequadas.",
    "Interns": "Estagiarios",
    "Tell us your preferred department or field and join the global intern programme.": "Indique o departamento ou area preferida e junte-se ao programa global de estagios.",
    "Support": "Suporte",
    "Frequently asked questions": "Perguntas frequentes",
    "How does the shortlist process work?": "Como funciona o processo de shortlist?",
    "We source, screen, and deliver a curated list of 3-5 pre-vetted candidates that can be reviewed anonymously.": "Procuramos, avaliamos e entregamos uma lista de 3-5 candidatos pre-avaliados que podem ser revistos anonimamente.",
    "How are candidates screened?": "Como sao avaliados os candidatos?",
    "Our recruiters review technical fit, cultural fit, credentials, readiness, and role expectations.": "Os nossos recrutadores avaliam enquadramento tecnico, cultural, credenciais, disponibilidade e expectativas da funcao.",
    "Are we obligated to hire?": "Somos obrigados a contratar?",
    "No. You only pay to unlock profiles you actually want to interview.": "Nao. So paga para desbloquear perfis que realmente quer entrevistar.",
    "Which industries do you support?": "Que industrias apoiam?",
    "We support more than 40 industries, including tech, finance, healthcare, legal, creative, operations, and leadership roles.": "Apoiamos mais de 40 industrias, incluindo tecnologia, financas, saude, juridico, criativo, operacoes e lideranca.",
    "Contact us": "Contacte-nos",
    "Let's start a conversation.": "Vamos conversar.",
    "Whether you are hiring or looking for a career-defining role, our team is here to help.": "Quer esteja a contratar ou a procurar uma oportunidade marcante, a nossa equipa pode ajudar.",
    "Request Callback": "Pedir contacto",
    "The right people, exactly when you need them.": "As pessoas certas, exatamente quando precisa delas.",
    "UrgentRecruite helps organizations receive vetted anonymous shortlists, while helping candidates and interns find roles that match their experience and ambition.": "A UrgentRecruite ajuda organizacoes a receber shortlists anonimas verificadas, enquanto ajuda candidatos e estagiarios a encontrar funcoes alinhadas com experiencia e ambicao.",
    "Services": "Servicos",
    "Anonymous candidate shortlists": "Shortlists anonimas de candidatos",
    "CV and profile screening": "Analise de CVs e perfis",
    "Internship matching": "Matching de estagios",
    "Pay-per-profile unlocks": "Desbloqueio por perfil",
    "Explore": "Explorar",
    "Platform": "Plataforma",
    "About Us": "Sobre nos",
    "Major market areas": "Principais mercados",
    "Accessible worldwide, with focused support in these markets.": "Acessivel mundialmente, com apoio focado nestes mercados.",
    "100% Data Protection Compliant": "100% conforme com protecao de dados",
    "Connect": "Ligar",
    "Let us meet you": "Vamos conhecer voce",
    "Your career interests": "Os seus interesses profissionais",
    "Your internship interest": "O seu interesse de estagio",
    "Let us have your CV": "Envie-nos o seu CV",
    "Organization details": "Dados da organizacao",
    "Role requirements": "Requisitos da funcao",
    "Share the brief": "Partilhe o brief"
  },
  fr: {
    "How it works": "Fonctionnement",
    "Pricing": "Tarifs",
    "About": "A propos",
    "FAQ": "FAQ",
    "Contact": "Contact",
    "Submit My CV": "Envoyer mon CV",
    "I want to Intern": "Je veux un stage",
    "Request Shortlist": "Demander une shortlist",
    "Menu": "Menu",
    "Close menu": "Fermer le menu",
    "Open menu": "Ouvrir le menu",
    "Language": "Langue",
    "Quality. Discretion. Speed.": "Qualite. Discretion. Rapidite.",
    "From vacancy to verified shortlist in record time.": "Du poste vacant a la shortlist verifiee en un temps record.",
    "UrgentRecruite helps organizations review anonymous, pre-vetted candidate profiles before choosing who to unlock and interview.": "UrgentRecruite aide les organisations a examiner des profils anonymes et prequalifies avant de choisir qui debloquer et interviewer.",
    "Request a Shortlist": "Demander une shortlist",
    "Average shortlist delivery": "Delai moyen de shortlist",
    "Industries served worldwide": "Secteurs couverts dans le monde",
    "Pay per profile unlocked": "Paiement par profil debloque",
    "Trusted by forward-thinking organizations": "Approuve par des organisations innovantes",
    "Our process": "Notre processus",
    "A simple, low-risk journey": "Un parcours simple et peu risque",
    "We build structured talent pipelines around your exact needs so you spend time hiring, not filtering.": "Nous construisons des pipelines de talents adaptes a vos besoins pour que vous passiez du temps a recruter, pas a filtrer.",
    "Share your vacancy": "Partagez votre poste",
    "Tell us the role, seniority, industry, and key requirements.": "Indiquez le role, le niveau, le secteur et les exigences principales.",
    "We source and screen": "Nous sourcons et evaluons",
    "Our recruiters review skills, culture fit, readiness, and experience.": "Nos recruteurs examinent les competences, l'adaptation culturelle, la disponibilite et l'experience.",
    "Receive anonymous profiles": "Recevez des profils anonymes",
    "Review curated candidates without seeing private contact details.": "Examinez des candidats selectionnes sans voir les coordonnees privees.",
    "Unlock and interview": "Debloquez et interviewez",
    "Pay only for the profiles you choose to unlock.": "Payez uniquement pour les profils que vous choisissez de debloquer.",
    "Pay only for the talent you want.": "Payez uniquement pour les talents que vous voulez.",
    "No retainers. No traditional placement percentages. Browse pre-vetted shortlists anonymously and unlock only the profiles you want to interview.": "Pas de frais initiaux. Pas de pourcentages traditionnels. Consultez des shortlists prequalifiees anonymement et debloquez seulement les profils a interviewer.",
    "Per profile unlocked": "Par profil debloque",
    "Download full profile and contact details only when you choose to proceed.": "Telechargez le profil complet et les coordonnees seulement lorsque vous decidez d'avancer.",
    "No upfront fees": "Aucun frais initial",
    "Unlimited shortlist reviews": "Revues de shortlist illimitees",
    "Pre-screened candidates": "Candidats prequalifies",
    "About us": "A propos de nous",
    "Built on trust, driven by results.": "Fonde sur la confiance, guide par les resultats.",
    "UrgentRecruite was created to solve the transparency and speed problem in traditional recruitment. We protect the privacy of both organizations and candidates while making high-quality shortlists easier to review.": "UrgentRecruite a ete cree pour resoudre les problemes de transparence et de rapidite du recrutement traditionnel. Nous protegeons la confidentialite des organisations et des candidats tout en rendant les shortlists de qualite plus faciles a examiner.",
    "Unwavering quality": "Qualite constante",
    "Every candidate is reviewed before they reach your shortlist.": "Chaque candidat est examine avant d'arriver dans votre shortlist.",
    "Total discretion": "Discretion totale",
    "Anonymous profile previews protect talent and reduce bias.": "Les apercus anonymes protegent les talents et reduisent les biais.",
    "Market-leading speed": "Rapidite de reference",
    "Most organizations receive curated shortlists in under 14 days.": "La plupart des organisations recoivent des shortlists en moins de 14 jours.",
    "Get started": "Commencer",
    "Choose the right path": "Choisissez le bon parcours",
    "The same backend can send each submission into your admin dashboard with the correct source flag.": "Le meme backend envoie chaque soumission dans votre tableau de bord admin avec la bonne source.",
    "Organizations": "Organisations",
    "Request a shortlist for an open role and receive a curated candidate pipeline.": "Demandez une shortlist pour un poste ouvert et recevez un pipeline de candidats selectionnes.",
    "Candidates": "Candidats",
    "Submit your CV so your profile can be considered for suitable roles.": "Envoyez votre CV afin que votre profil soit considere pour des roles adaptes.",
    "Interns": "Stagiaires",
    "Tell us your preferred department or field and join the global intern programme.": "Indiquez votre departement ou domaine prefere et rejoignez le programme mondial de stages.",
    "Support": "Support",
    "Frequently asked questions": "Questions frequentes",
    "How does the shortlist process work?": "Comment fonctionne le processus de shortlist ?",
    "We source, screen, and deliver a curated list of 3-5 pre-vetted candidates that can be reviewed anonymously.": "Nous sourcons, evaluons et livrons une liste de 3-5 candidats prequalifies consultables anonymement.",
    "How are candidates screened?": "Comment les candidats sont-ils evalues ?",
    "Our recruiters review technical fit, cultural fit, credentials, readiness, and role expectations.": "Nos recruteurs examinent l'adequation technique, culturelle, les justificatifs, la disponibilite et les attentes du role.",
    "Are we obligated to hire?": "Sommes-nous obliges d'embaucher ?",
    "No. You only pay to unlock profiles you actually want to interview.": "Non. Vous payez uniquement pour debloquer les profils que vous voulez vraiment interviewer.",
    "Which industries do you support?": "Quels secteurs couvrez-vous ?",
    "We support more than 40 industries, including tech, finance, healthcare, legal, creative, operations, and leadership roles.": "Nous couvrons plus de 40 secteurs, dont technologie, finance, sante, juridique, creatif, operations et leadership.",
    "Contact us": "Contactez-nous",
    "Let's start a conversation.": "Commencons une conversation.",
    "Whether you are hiring or looking for a career-defining role, our team is here to help.": "Que vous recrutiez ou cherchiez un role determinant, notre equipe est la pour vous aider.",
    "Request Callback": "Demander un rappel",
    "The right people, exactly when you need them.": "Les bonnes personnes, exactement quand vous en avez besoin.",
    "UrgentRecruite helps organizations receive vetted anonymous shortlists, while helping candidates and interns find roles that match their experience and ambition.": "UrgentRecruite aide les organisations a recevoir des shortlists anonymes verifiees, tout en aidant les candidats et stagiaires a trouver des roles alignes avec leur experience et leur ambition.",
    "Services": "Services",
    "Anonymous candidate shortlists": "Shortlists anonymes de candidats",
    "CV and profile screening": "Analyse de CV et de profils",
    "Internship matching": "Matching de stages",
    "Pay-per-profile unlocks": "Deblocage par profil",
    "Explore": "Explorer",
    "Platform": "Plateforme",
    "About Us": "A propos",
    "Major market areas": "Principales zones de marche",
    "Accessible worldwide, with focused support in these markets.": "Accessible dans le monde entier, avec un support cible dans ces marches.",
    "100% Data Protection Compliant": "100% conforme a la protection des donnees",
    "Connect": "Connecter",
    "Let us meet you": "Faisons connaissance",
    "Your career interests": "Vos interets professionnels",
    "Your internship interest": "Votre interet pour un stage",
    "Let us have your CV": "Envoyez-nous votre CV",
    "Organization details": "Details de l'organisation",
    "Role requirements": "Exigences du role",
    "Share the brief": "Partager le brief"
  }
};

const placeholderTranslations = {
  de: {
    "Enter your full name": "Vollstandigen Namen eingeben",
    "Start typing a country": "Land eingeben",
    "Start typing your field": "Fachgebiet eingeben",
    "Select experience": "Erfahrung auswahlen",
    "Add a short note about your experience, achievements, preferred roles, tools, certifications, and career goals...": "Erzahlen Sie kurz von Erfahrung, Erfolgen, Wunschrollen, Tools, Zertifikaten und Karrierezielen...",
    "Write a short note about yourself...": "Schreiben Sie eine kurze Notiz uber sich...",
    "Write a short note for us about your preferred department, field, or internship goals...": "Schreiben Sie kurz uber Ihren bevorzugten Bereich, Ihr Fachgebiet oder Ihre Praktikumsziele...",
    "Full Name": "Vollstandiger Name",
    "Work Email": "Berufliche E-Mail",
    "Your Company": "Ihr Unternehmen",
    "Company LinkedIn URL": "LinkedIn-URL des Unternehmens",
    "e.g. Technology, Finance": "z. B. Technologie, Finanzen",
    "e.g. Senior Product Manager": "z. B. Senior Product Manager",
    "e.g. 5+ years": "z. B. 5+ Jahre",
    "Your full name": "Ihr vollstandiger Name",
    "Your company email": "Ihre Firmen-E-Mail",
    "+44 your phone number": "Ihre Telefonnummer",
    "A short note about your request": "Eine kurze Notiz zu Ihrer Anfrage"
  },
  es: {
    "Enter your full name": "Introduce tu nombre completo",
    "Start typing a country": "Empieza a escribir un pais",
    "Start typing your field": "Empieza a escribir tu area",
    "Select experience": "Selecciona experiencia",
    "Add a short note about your experience, achievements, preferred roles, tools, certifications, and career goals...": "Agrega una breve nota sobre tu experiencia, logros, roles preferidos, herramientas, certificaciones y objetivos...",
    "Write a short note about yourself...": "Escribe una breve nota sobre ti...",
    "Write a short note for us about your preferred department, field, or internship goals...": "Escribe una breve nota sobre tu departamento, area u objetivos de practicas...",
    "Full Name": "Nombre completo",
    "Work Email": "Email de trabajo",
    "Your Company": "Tu empresa",
    "Company LinkedIn URL": "LinkedIn de la empresa",
    "e.g. Technology, Finance": "p. ej. Tecnologia, Finanzas",
    "e.g. Senior Product Manager": "p. ej. Senior Product Manager",
    "e.g. 5+ years": "p. ej. 5+ anos",
    "Your full name": "Tu nombre completo",
    "Your company email": "Email de empresa",
    "+44 your phone number": "Tu numero de telefono",
    "A short note about your request": "Una breve nota sobre tu solicitud"
  },
  pt: {
    "Enter your full name": "Introduza o seu nome completo",
    "Start typing a country": "Comece a escrever o pais",
    "Start typing your field": "Comece a escrever a sua area",
    "Select experience": "Selecione experiencia",
    "Add a short note about your experience, achievements, preferred roles, tools, certifications, and career goals...": "Adicione uma nota breve sobre experiencia, conquistas, funcoes preferidas, ferramentas, certificacoes e objetivos...",
    "Write a short note about yourself...": "Escreva uma breve nota sobre si...",
    "Write a short note for us about your preferred department, field, or internship goals...": "Escreva uma breve nota sobre o departamento, area ou objetivos de estagio que prefere...",
    "Full Name": "Nome completo",
    "Work Email": "Email profissional",
    "Your Company": "A sua empresa",
    "Company LinkedIn URL": "LinkedIn da empresa",
    "e.g. Technology, Finance": "ex. Tecnologia, Financas",
    "e.g. Senior Product Manager": "ex. Senior Product Manager",
    "e.g. 5+ years": "ex. 5+ anos",
    "Your full name": "O seu nome completo",
    "Your company email": "Email da empresa",
    "+44 your phone number": "O seu telefone",
    "A short note about your request": "Uma breve nota sobre o pedido"
  },
  fr: {
    "Enter your full name": "Saisissez votre nom complet",
    "Start typing a country": "Commencez a saisir un pays",
    "Start typing your field": "Commencez a saisir votre domaine",
    "Select experience": "Selectionnez l'experience",
    "Add a short note about your experience, achievements, preferred roles, tools, certifications, and career goals...": "Ajoutez une courte note sur votre experience, vos realisations, roles preferes, outils, certifications et objectifs...",
    "Write a short note about yourself...": "Ecrivez une courte note sur vous...",
    "Write a short note for us about your preferred department, field, or internship goals...": "Ecrivez une courte note sur votre departement, domaine ou objectifs de stage preferes...",
    "Full Name": "Nom complet",
    "Work Email": "Email professionnel",
    "Your Company": "Votre entreprise",
    "Company LinkedIn URL": "LinkedIn de l'entreprise",
    "e.g. Technology, Finance": "ex. Technologie, Finance",
    "e.g. Senior Product Manager": "ex. Senior Product Manager",
    "e.g. 5+ years": "ex. 5+ ans",
    "Your full name": "Votre nom complet",
    "Your company email": "Votre email professionnel",
    "+44 your phone number": "Votre numero de telephone",
    "A short note about your request": "Une courte note sur votre demande"
  }
};

const formFieldTranslations = {
  de: {
    "Candidate profile": "Kandidatenprofil",
    "Internship application": "Praktikumsbewerbung",
    "Hiring request": "Einstellungsanfrage",
    "Tell us about yourself so we can get your profile in front of the right organizations.": "Erzahlen Sie uns von sich, damit wir Ihr Profil passenden Unternehmen vorstellen konnen.",
    "Share your background and preferred department so we can match you with internship opportunities.": "Teilen Sie Ihren Hintergrund und bevorzugten Bereich, damit wir passende Praktika finden konnen.",
    "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.": "Sagen Sie uns, was Sie brauchen, und unser Team erstellt eine geprufte Shortlist fur Ihre Vakanz.",
    "Full Name": "Vollstandiger Name",
    "Email Address": "E-Mail-Adresse",
    "Country": "Land",
    "Contact Number": "Telefonnummer",
    "LinkedIn Profile": "LinkedIn-Profil",
    "Field of Experience": "Fachgebiet",
    "Years of Experience": "Jahre Erfahrung",
    "Expected Salary": "Gehaltsvorstellung",
    "Career Interests": "Karriereinteressen",
    "Note for us": "Notiz fur uns",
    "Upload CV": "Lebenslauf hochladen",
    "Optional note to help us understand the roles, departments, and locations you prefer.": "Optionale Notiz, damit wir Rollen, Bereiche und Standorte verstehen, die Sie bevorzugen.",
    "Upload your CV or resume in PDF, DOC, DOCX, TXT, or RTF format.": "Laden Sie Ihren Lebenslauf im Format PDF, DOC, DOCX, TXT oder RTF hoch.",
    "Your Full Name": "Ihr vollstandiger Name",
    "Work Email Address": "Berufliche E-Mail-Adresse",
    "Company Name": "Unternehmensname",
    "Company LinkedIn URL": "LinkedIn-URL des Unternehmens",
    "Industry": "Branche",
    "Job Title": "Jobtitel",
    "Years Required": "Erforderliche Jahre",
    "Annual Gross Pay": "Jahresbruttogehalt",
    "Job Description": "Stellenbeschreibung",
    "Job Specification": "Anforderungsprofil",
    "Upload Existing JD or Specification": "Vorhandene Stellenbeschreibung hochladen",
    "LinkedIn-ready job advert": "LinkedIn-fertige Stellenanzeige",
    "Generate JD": "JD erstellen",
    "Generated Job Description and Specification": "Erstellte Stellenbeschreibung und Spezifikation",
    "Cancel": "Abbrechen",
    "Back": "Zuruck",
    "Continue": "Weiter",
    "Submit Profile": "Profil einreichen",
    "Submit Internship Profile": "Praktikumsprofil einreichen",
    "Submit Hiring Request": "Einstellungsanfrage senden"
  },
  es: {
    "Candidate profile": "Perfil de candidato",
    "Internship application": "Solicitud de practicas",
    "Hiring request": "Solicitud de contratacion",
    "Tell us about yourself so we can get your profile in front of the right organizations.": "Cuentanos sobre ti para presentar tu perfil a las organizaciones adecuadas.",
    "Share your background and preferred department so we can match you with internship opportunities.": "Comparte tu trayectoria y departamento preferido para conectar tu perfil con oportunidades de practicas.",
    "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.": "Dinos que necesitas y nuestro equipo preparara una shortlist verificada para tu vacante.",
    "Full Name": "Nombre completo",
    "Email Address": "Correo electronico",
    "Country": "Pais",
    "Contact Number": "Numero de contacto",
    "LinkedIn Profile": "Perfil de LinkedIn",
    "Field of Experience": "Area de experiencia",
    "Years of Experience": "Anos de experiencia",
    "Expected Salary": "Salario esperado",
    "Career Interests": "Intereses profesionales",
    "Note for us": "Nota para nosotros",
    "Upload CV": "Subir CV",
    "Optional note to help us understand the roles, departments, and locations you prefer.": "Nota opcional para entender los roles, departamentos y ubicaciones que prefieres.",
    "Upload your CV or resume in PDF, DOC, DOCX, TXT, or RTF format.": "Sube tu CV en formato PDF, DOC, DOCX, TXT o RTF.",
    "Your Full Name": "Tu nombre completo",
    "Work Email Address": "Correo de trabajo",
    "Company Name": "Nombre de la empresa",
    "Company LinkedIn URL": "URL de LinkedIn de la empresa",
    "Industry": "Sector",
    "Job Title": "Titulo del puesto",
    "Years Required": "Anos requeridos",
    "Annual Gross Pay": "Salario bruto anual",
    "Job Description": "Descripcion del puesto",
    "Job Specification": "Especificacion del puesto",
    "Upload Existing JD or Specification": "Subir JD o especificacion existente",
    "LinkedIn-ready job advert": "Anuncio listo para LinkedIn",
    "Generate JD": "Generar JD",
    "Generated Job Description and Specification": "Descripcion y especificacion generadas",
    "Cancel": "Cancelar",
    "Back": "Atras",
    "Continue": "Continuar",
    "Submit Profile": "Enviar perfil",
    "Submit Internship Profile": "Enviar perfil de practicas",
    "Submit Hiring Request": "Enviar solicitud"
  },
  pt: {
    "Candidate profile": "Perfil do candidato",
    "Internship application": "Candidatura a estagio",
    "Hiring request": "Pedido de contratacao",
    "Tell us about yourself so we can get your profile in front of the right organizations.": "Fale-nos sobre si para apresentarmos o seu perfil as organizacoes certas.",
    "Share your background and preferred department so we can match you with internship opportunities.": "Partilhe o seu percurso e departamento preferido para encontrarmos oportunidades de estagio.",
    "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.": "Diga-nos o que precisa e a nossa equipa prepara uma shortlist verificada para a vaga.",
    "Full Name": "Nome completo",
    "Email Address": "Email",
    "Country": "Pais",
    "Contact Number": "Numero de contacto",
    "LinkedIn Profile": "Perfil LinkedIn",
    "Field of Experience": "Area de experiencia",
    "Years of Experience": "Anos de experiencia",
    "Expected Salary": "Salario esperado",
    "Career Interests": "Interesses profissionais",
    "Note for us": "Nota para nos",
    "Upload CV": "Carregar CV",
    "Optional note to help us understand the roles, departments, and locations you prefer.": "Nota opcional para entendermos as funcoes, departamentos e locais que prefere.",
    "Upload your CV or resume in PDF, DOC, DOCX, TXT, or RTF format.": "Carregue o seu CV em formato PDF, DOC, DOCX, TXT ou RTF.",
    "Your Full Name": "O seu nome completo",
    "Work Email Address": "Email profissional",
    "Company Name": "Nome da empresa",
    "Company LinkedIn URL": "URL LinkedIn da empresa",
    "Industry": "Industria",
    "Job Title": "Titulo da funcao",
    "Years Required": "Anos exigidos",
    "Annual Gross Pay": "Remuneracao bruta anual",
    "Job Description": "Descricao da funcao",
    "Job Specification": "Especificacao da funcao",
    "Upload Existing JD or Specification": "Carregar JD ou especificacao existente",
    "LinkedIn-ready job advert": "Anuncio pronto para LinkedIn",
    "Generate JD": "Gerar JD",
    "Generated Job Description and Specification": "Descricao e especificacao geradas",
    "Cancel": "Cancelar",
    "Back": "Voltar",
    "Continue": "Continuar",
    "Submit Profile": "Enviar perfil",
    "Submit Internship Profile": "Enviar perfil de estagio",
    "Submit Hiring Request": "Enviar pedido"
  },
  fr: {
    "Candidate profile": "Profil candidat",
    "Internship application": "Candidature de stage",
    "Hiring request": "Demande de recrutement",
    "Tell us about yourself so we can get your profile in front of the right organizations.": "Parlez-nous de vous afin que nous puissions presenter votre profil aux bonnes organisations.",
    "Share your background and preferred department so we can match you with internship opportunities.": "Partagez votre parcours et votre departement prefere afin de vous proposer des stages adaptes.",
    "Tell us what you need and our team will prepare a verified shortlist tailored to your vacancy.": "Dites-nous ce dont vous avez besoin et notre equipe preparera une shortlist verifiee pour votre poste.",
    "Full Name": "Nom complet",
    "Email Address": "Adresse email",
    "Country": "Pays",
    "Contact Number": "Numero de contact",
    "LinkedIn Profile": "Profil LinkedIn",
    "Field of Experience": "Domaine d'experience",
    "Years of Experience": "Annees d'experience",
    "Expected Salary": "Salaire attendu",
    "Career Interests": "Interets professionnels",
    "Note for us": "Note pour nous",
    "Upload CV": "Televerser le CV",
    "Optional note to help us understand the roles, departments, and locations you prefer.": "Note facultative pour comprendre les roles, departements et lieux que vous preferez.",
    "Upload your CV or resume in PDF, DOC, DOCX, TXT, or RTF format.": "Televersez votre CV au format PDF, DOC, DOCX, TXT ou RTF.",
    "Your Full Name": "Votre nom complet",
    "Work Email Address": "Email professionnel",
    "Company Name": "Nom de l'entreprise",
    "Company LinkedIn URL": "URL LinkedIn de l'entreprise",
    "Industry": "Secteur",
    "Job Title": "Intitule du poste",
    "Years Required": "Annees requises",
    "Annual Gross Pay": "Remuneration brute annuelle",
    "Job Description": "Description du poste",
    "Job Specification": "Specification du poste",
    "Upload Existing JD or Specification": "Televerser une JD ou specification existante",
    "LinkedIn-ready job advert": "Annonce prete pour LinkedIn",
    "Generate JD": "Generer JD",
    "Generated Job Description and Specification": "Description et specification generees",
    "Cancel": "Annuler",
    "Back": "Retour",
    "Continue": "Continuer",
    "Submit Profile": "Envoyer le profil",
    "Submit Internship Profile": "Envoyer le profil de stage",
    "Submit Hiring Request": "Envoyer la demande"
  }
};

function t(value) {
  return formFieldTranslations[currentLanguage]?.[value]
    || translations[currentLanguage]?.[value]
    || value;
}

function translateTextNode(node) {
  const original = node.__urgentRecruiteSourceText || node.nodeValue.trim();
  if (!original) return;

  node.__urgentRecruiteSourceText = original;
  const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
  const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
  node.nodeValue = `${leading}${t(original)}${trailing}`;
}

function translatePlaceholders() {
  document.querySelectorAll("[placeholder]").forEach((element) => {
    const original = element.dataset.originalPlaceholder || element.getAttribute("placeholder") || "";
    element.dataset.originalPlaceholder = original;
    element.setAttribute("placeholder", placeholderTranslations[currentLanguage]?.[original] || t(original));
  });
}

function translateStaticPage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(translateTextNode);
  translatePlaceholders();
}

function getStepLabels(type = currentFormType) {
  if (type === "shortlist") {
    return [t("Organization details"), t("Role requirements"), t("Share the brief")];
  }

  if (type === "intent") {
    return [t("Let us meet you"), t("Your internship interest"), t("Let us have your CV")];
  }

  return [t("Let us meet you"), t("Your career interests"), t("Let us have your CV")];
}

function setLanguage(language) {
  currentLanguage = language || "en";
  document.documentElement.lang = currentLanguage;
  window.localStorage.setItem("urgentRecruiteLanguage", currentLanguage);
  translateStaticPage();
  applyFormCopy(currentFormType);
  setFormStep(currentFormStep);
  updateMenuState(siteHeader.classList.contains("open"));
  updateWordCount();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 5200);
}

function getSupabaseClient() {
  return window.urgentRecruiteSupabase || null;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function getSelectedCountryMeta() {
  return getCountryMeta(countryInput.value) || countries.find((country) => country.currency === "USD") || countries[0];
}

function formatCurrency(value, country = getSelectedCountryMeta()) {
  const amount = parseMoney(value);
  if (!amount) return "competitive compensation";

  return new Intl.NumberFormat(country.locale || "en-US", {
    style: "currency",
    currency: country.currency || "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function countWords(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function populateDatalist(id, values) {
  const list = document.querySelector(`#${id}`);
  list.innerHTML = values
    .map((value) => typeof value === "string" ? value : value.name)
    .map((value) => `<option value="${value}"></option>`)
    .join("");
}

function getCountryMeta(name) {
  const normalized = String(name || "").trim().toLowerCase();
  return countries.find((country) => country.name.toLowerCase() === normalized) || null;
}

function updatePhoneForCountry() {
  const country = getCountryMeta(countryInput.value);
  const dialCode = country?.dialCode || "+1";
  phoneInput.placeholder = `${dialCode} phone number`;

  if (!phoneInput.value.trim()) {
    phoneInput.value = `${dialCode} `;
  }

  updateCurrencyForCountry();
}

function updateCurrencyForCountry() {
  const country = getSelectedCountryMeta();
  const placeholderAmount = country.currency === "NGN" ? 30000000
    : country.currency === "KES" ? 6500000
      : country.currency === "EUR" ? 50000
        : country.currency === "GBP" ? 45000
          : country.currency === "GHS" ? 700000
            : country.currency === "ZAR" ? 900000
              : 50000;

  [candidateCurrencyCode, requestCurrencyCode].forEach((element) => {
    if (element) element.textContent = country.currency || "USD";
  });

  [candidateSalaryInput, requestPayInput].forEach((input) => {
    if (!input) return;
    input.placeholder = `${country.symbol || "$"}${new Intl.NumberFormat(country.locale || "en-US", {
      maximumFractionDigits: 0
    }).format(placeholderAmount)}`;
  });
}

function updateWordCount() {
  summaryWordCount.textContent = t("Optional note to help us understand the roles, departments, and locations you prefer.");
  summaryWordCount.classList.add("valid");
}

function getVisibleStepFields() {
  return applicationForm.querySelectorAll(`[data-step]`);
}

function setFormStep(step) {
  currentFormStep = Math.min(3, Math.max(1, step));

  getVisibleStepFields().forEach((field) => {
    field.classList.toggle("step-hidden", Number(field.dataset.step) !== currentFormStep);
  });

  formProgress.querySelectorAll("span").forEach((item, index) => {
    const stepNumber = index + 1;
    item.textContent = getStepLabels()[index];
    item.classList.toggle("active", stepNumber === currentFormStep);
    item.classList.toggle("complete", stepNumber < currentFormStep);
  });

  previousStepButton.hidden = currentFormStep === 1;
  nextStepButton.hidden = currentFormStep === 3;
  submitButton.hidden = currentFormStep !== 3;
}

function resetFormSteps() {
  currentFormStep = 1;
  setFormStep(1);
  updateWordCount();
}

function hasUploadedFile(file) {
  return file instanceof File && Boolean(file.name);
}

function sanitizeFileName(fileName) {
  return String(fileName || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadSupabaseFile(file, bucket, folder) {
  if (!hasUploadedFile(file)) return { path: "", name: "" };

  const client = getSupabaseClient();
  if (!client) return { path: "", name: file.name };

  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;
  return { path: data.path, name: file.name };
}

function openForm(type) {
  currentFormType = type;
  sourceInput.value = type;
  applyFormCopy(type);

  const isShortlist = type === "shortlist";
  const isIntent = type === "intent";
  candidateFields.classList.toggle("hidden", isShortlist);
  shortlistFields.classList.toggle("hidden", !isShortlist);
  salaryField.classList.toggle("hidden", isIntent);
  applicationForm.reset();
  sourceInput.value = type;
  updatePhoneForCountry();
  updateCurrencyForCountry();
  resetFormSteps();
  formDialog.showModal();
}

function applyFormCopy(type = currentFormType) {
  const selected = formCopy[type] || formCopy.cv;
  formEyebrow.textContent = t(selected.eyebrow);
  formTitle.textContent = t(selected.title);
  formDescription.textContent = t(selected.description);
  submitButton.textContent = t(selected.button);

  const isIntent = type === "intent";
  summaryLabel.textContent = isIntent ? t("Note for us") : t("Career Interests");
  summaryTextarea.placeholder = isIntent
    ? placeholderTranslations[currentLanguage]?.["Write a short note for us about your preferred department, field, or internship goals..."] || "Write a short note for us about your preferred department, field, or internship goals..."
    : placeholderTranslations[currentLanguage]?.["Write a short note about yourself..."] || "Write a short note about yourself...";
}

function toPayload(form) {
  const data = new FormData(form);
  const payload = {
    submittedAt: new Date().toISOString(),
    source: data.get("source")
  };

  data.forEach((value, key) => {
    if (value instanceof File) {
      payload[key] = value.name || "";
    } else {
      payload[key] = value;
    }
  });

  return payload;
}

function updateMenuState(isOpen) {
  siteHeader.classList.toggle("open", isOpen);
  menuButton.textContent = isOpen ? t("Close menu") : t("Menu");
  menuButton.setAttribute("aria-label", isOpen ? t("Close menu") : t("Open menu"));
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function sentenceCaseList(value, fallback) {
  return String(value || fallback)
    .split(/\n|;|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 7);
}

function bulletList(items) {
  return items.map((item) => `- ${item.replace(/^[-*]\s*/, "")}`).join("\n");
}

function generateVacancyBrief() {
  const data = new FormData(applicationForm);
  const companyName = data.get("companyName") || "Our organization";
  const industry = data.get("industry") || "the relevant industry";
  const jobTitle = data.get("jobTitle") || "the open role";
  const yearsRequired = data.get("yearsRequired") || "relevant experience";
  const annualPay = formatCurrency(data.get("annualPay"));
  const jobDescription = data.get("jobDescription") || "Own key responsibilities, collaborate with cross-functional stakeholders, improve team execution, and deliver measurable outcomes.";
  const jobSpecification = data.get("jobSpecification") || "Strong communication, ownership, analytical thinking, role-specific competence, and readiness to contribute quickly.";
  const uploadedDocument = data.get("jobDocument");
  const sourceNote = hasUploadedFile(uploadedDocument)
    ? `\n\nSource note: This advert should also be reviewed against the uploaded document "${uploadedDocument.name}" before publishing.`
    : "";

  const responsibilities = sentenceCaseList(jobDescription, jobDescription);
  const requirements = sentenceCaseList(jobSpecification, jobSpecification);

  generatedBrief.value = [
    `${companyName} is hiring: ${jobTitle}`,
    "",
    `About the role`,
    `${companyName} is looking for a ${jobTitle} to join its ${industry} team. This role is designed for a high-ownership professional with ${yearsRequired}, sound judgement, and the ability to turn business priorities into consistent execution. The compensation basis shared for this role is ${annualPay}.`,
    "",
    "What you will do",
    bulletList(responsibilities),
    "",
    "What we are looking for",
    bulletList(requirements),
    "",
    "Ideal candidate profile",
    `The strongest candidates will show clear evidence of relevant ${industry} experience, practical delivery in a comparable ${jobTitle} role, strong communication, and the maturity to operate with minimal hand-holding. They should be able to explain what they have built, improved, led, or delivered in previous roles.`,
    "",
    "LinkedIn advert summary",
    `${companyName} is hiring a ${jobTitle}. If you have ${yearsRequired}, a strong track record in ${industry}, and the ability to deliver with clarity and ownership, we would like to hear from you.`,
    sourceNote
  ].join("\n");

  showToast("Professional advert generated. Review it against the role details before publishing.");
}

async function postOrStore(endpoint, payload, storageKey) {
  if (!endpoint) {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.push(payload);
    localStorage.setItem(storageKey, JSON.stringify(existing));
    return { storedLocally: true };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response.json().catch(() => ({}));
}

async function saveApplicationToSupabase(formData, payload) {
  const client = getSupabaseClient();
  if (!client) return false;

  if (payload.source === "shortlist") {
    const documentUpload = await uploadSupabaseFile(formData.get("jobDocument"), "job-documents", "shortlist-requests");
    const { error } = await client.from("shortlist_requests").insert({
      organization: payload.companyName || "Unnamed organization",
      contact_name: payload.contactName || "",
      work_email: payload.workEmail || "",
      company_linkedin: payload.companyLinkedin || "",
      industry: payload.industry || "",
      job_title: payload.jobTitle || "Shortlist request",
      years_required: payload.yearsRequired || "",
      annual_gross_pay: parseMoney(payload.annualPay),
      job_description: payload.jobDescription || "",
      job_specification: payload.jobSpecification || "",
      generated_brief: payload.generatedBrief || "",
      job_document_name: documentUpload.name,
      job_document_path: documentUpload.path
    });

    if (error) throw error;
    return true;
  }

  const cvUpload = await uploadSupabaseFile(formData.get("cvFile"), "candidate-cvs", "profiles");
  const selectedCurrency = getSelectedCountryMeta().currency || "USD";
  const { error } = await client.from("profiles").insert({
    full_name: payload.fullName || "Unnamed candidate",
    email: payload.email || "",
    phone: payload.phone || "",
    linkedin: payload.linkedin || "",
    role: payload.field || "Candidate profile",
    location: payload.country || "",
    experience: payload.experience || "",
    expected_salary: payload.source === "intent" ? "" : [selectedCurrency, payload.salary].filter(Boolean).join(" "),
    skills: [payload.field || "General profile"].filter(Boolean),
    source: payload.source === "intent" ? "intent" : "cv",
    summary: payload.summary || "",
    word_count: 0,
    parse_status: "pending",
    contact_details: [payload.email, payload.phone, payload.linkedin].filter(Boolean).join(" / "),
    notes: cvUpload.name ? `Uploaded file: ${cvUpload.name}` : "Submitted from landing page",
    cv_file_name: cvUpload.name,
    cv_file_path: cvUpload.path
  });

  if (error) throw error;
  return true;
}

async function saveDeletedProfileToSupabase(payload, reason) {
  const client = getSupabaseClient();
  const deletedProfile = {
    full_name: payload.fullName || "Unnamed candidate",
    email: payload.email || "",
    phone: payload.phone || "",
    linkedin: payload.linkedin || "",
    role: payload.field || "Candidate profile",
    location: payload.country || "",
    experience: payload.experience || "",
    source: payload.source === "intent" ? "intent" : "cv",
    summary: payload.summary || "",
    word_count: 0,
    contact_details: [payload.email, payload.phone, payload.linkedin].filter(Boolean).join(" / "),
    notes: payload.cvFile ? `Uploaded file: ${payload.cvFile}` : "Submission did not meet profile detail threshold.",
    deletion_reason: reason,
    delete_after: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  };

  if (!client) {
    const existing = JSON.parse(localStorage.getItem("urgentRecruiteDeletedProfiles") || "[]");
    existing.push({ ...deletedProfile, submittedAt: new Date().toISOString() });
    localStorage.setItem("urgentRecruiteDeletedProfiles", JSON.stringify(existing));
    return true;
  }

  const { error } = await client.from("deleted_profiles").insert(deletedProfile);
  if (error) throw error;
  return true;
}

async function saveContactToSupabase(payload) {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client.from("contact_requests").insert({
    full_name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    message: payload.message || ""
  });

  if (error) throw error;
  return true;
}

document.querySelectorAll("[data-form]").forEach((button) => {
  button.addEventListener("click", () => openForm(button.dataset.form));
});

populateDatalist("country-options", countries);
populateDatalist("experience-field-options", experienceFields);
populateDatalist("experience-year-options", experienceYears);
populateDatalist("industry-options", industries);

countryInput.addEventListener("input", updatePhoneForCountry);
summaryTextarea.addEventListener("input", updateWordCount);
languageSelect.addEventListener("change", () => setLanguage(languageSelect.value));

previousStepButton.addEventListener("click", () => setFormStep(currentFormStep - 1));
nextStepButton.addEventListener("click", () => setFormStep(currentFormStep + 1));

document.querySelector("#cancel-form").addEventListener("click", () => {
  formDialog.close();
});

menuButton.addEventListener("click", () => {
  updateMenuState(!siteHeader.classList.contains("open"));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => updateMenuState(false));
});

generateBriefButton.addEventListener("click", generateVacancyBrief);

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (currentFormStep < 3) {
    setFormStep(currentFormStep + 1);
    return;
  }

  const formData = new FormData(applicationForm);
  const payload = toPayload(applicationForm);
  const isShortlist = payload.source === "shortlist";
  const endpoint = isShortlist ? CONFIG.shortlistEndpoint : CONFIG.profileEndpoint;
  const storageKey = isShortlist ? "urgentRecruiteShortlistRequests" : "urgentRecruiteProfiles";

  try {
    const savedToSupabase = await saveApplicationToSupabase(formData, payload);
    if (!savedToSupabase) {
      await postOrStore(endpoint, payload, storageKey);
    }
    formDialog.close();
    showToast(isShortlist
      ? "Hiring request received. Our team will review the role details and prepare your shortlist workflow."
      : "Profile submitted successfully. Our team will review your CV and prepare it for suitable opportunities.");
  } catch (error) {
    showToast("Could not submit yet. Please check Supabase setup.");
  }
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = toPayload(event.currentTarget);

  try {
    const savedToSupabase = await saveContactToSupabase(payload);
    if (!savedToSupabase) {
      await postOrStore(CONFIG.contactEndpoint, payload, "urgentRecruiteContactRequests");
    }
    event.currentTarget.reset();
    showToast("Callback request received.");
  } catch (error) {
    showToast("Could not submit contact request yet.");
  }
});

const savedLanguage = window.localStorage.getItem("urgentRecruiteLanguage") || "en";
languageSelect.value = savedLanguage;
setLanguage(savedLanguage);
updateCurrencyForCountry();

window.urgentRecruiteConfig = CONFIG;
