import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

type AliasMap = Record<string, string>;
const hash = (pw: string) => bcrypt.hashSync(pw, 10);
const now = () => new Date();

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in tasker-backend/.env');
  await mongoose.connect(uri);
  console.log('✅ Kết nối MongoDB thành công');
  const db = mongoose.connection.db!;
  await db.dropDatabase();
  console.log('🗑️  Đã xóa database cũ');

  const userDefs = [
    ['u_admin','admin@aitasker.dev','AITasker Admin','admin','Quản trị viên hệ thống','',[],0,100,true,0],
    ['u_client','client@aitasker.dev','Minh Labs','client','Product Owner','Minh Labs Co.',[],0,88,false,5000],
    ['u_expert','expert@aitasker.dev','An Trần','expert','RAG / LLM Engineer','', ['LangChain','Vector DB','Python','FastAPI'],85,96,true,1200],
    ['u_enterprise','enterprise@aitasker.dev','Nova Enterprise','enterprise','AI Program Office','Nova Corp',[],0,91,false,20000],
    ['u_expert2','linh.cv@aitasker.dev','Nguyễn Linh','expert','Computer Vision Engineer','', ['YOLO','OpenCV','PyTorch','TensorFlow','Data Labeling'],70,93,true,900],
    ['u_expert3','huy.mlops@aitasker.dev','Trần Quang Huy','expert','MLOps & AI Infrastructure Engineer','', ['Docker','Kubernetes','GitHub Actions','MLflow','PromptOps'],90,85,false,400],
    ['u_expert4','mai.nlp@aitasker.dev','Phạm Thị Mai','expert','NLP Engineer — Vietnamese Language Specialist','', ['PhoBERT','HuggingFace','FastAPI','Text Classification','Named Entity Recognition'],65,90,true,720],
    ['u_expert5','anh.agent@aitasker.dev','Lê Đức Anh','expert','AI Agent Developer & Process Automation','', ['LangGraph','AutoGPT','n8n','Make.com','Zapier','Node.js'],80,88,true,650],
    ['u_client2','minh.shop@aitasker.dev','Hoàng Văn Minh','client','Founder & CEO','Minh Fashion Store',[],0,84,false,3000],
    ['u_client3','huong.logistics@aitasker.dev','Trần Thị Hương','client','CTO / Product Lead','FastMove Logistics',[],0,87,false,8000],
    ['u_client4','greenfarm@aitasker.dev','GreenFarm AI','client','AgriTech Product Team','GreenFarm',[],0,81,false,4200],
    ['u_client5','mediahub@aitasker.dev','Saigon Media Hub','client','Marketing Lead','Saigon Media Hub',[],0,83,false,2500],
  ];
  const insertedUsers = await db.collection('users').insertMany(userDefs.map(([alias,email,fullName,role,title,company,skills,hourlyRate,trustScore,isVerified,walletBalance]) => ({
    email, passwordHash: hash('demo1234'), fullName, role, title, company, skills, hourlyRate, trustScore, isVerified, walletBalance,
    bio: role === 'expert' ? `${fullName} có kinh nghiệm triển khai AI production cho doanh nghiệp Việt Nam.` : '',
    avatarUrl: String(fullName).split(' ').map(x => x[0]).join('').slice(-2).toUpperCase(),
    enterpriseId: role === 'enterprise' ? 'ent_nova' : '', language: 'vi', emailVerified: true, createdAt: now(), updatedAt: now()
  })));
  const users: AliasMap = {}; userDefs.forEach(([alias], i) => users[String(alias)] = String(insertedUsers.insertedIds[i]));

  const jobDefs = [
    ['job_ecom_ai','Xây dựng website bán hàng thời trang tích hợp AI gợi ý sản phẩm','u_client2','AI/E-commerce',3500,'4 tuần','Pro','open',['Next.js','Recommendation System','Python','MongoDB']],
    ['job_logistics_chatbot','Chatbot chăm sóc khách hàng tự động cho sàn logistics','u_client3','LLM / RAG',4800,'5 tuần','Pro','open',['LangChain','GPT-4','Webhook','Zalo API']],
    ['job_fraud_ml','Hệ thống phát hiện gian lận giao dịch real-time bằng ML','u_enterprise','ML / Fraud Detection',9200,'8 tuần','Enterprise','pending_approval',['XGBoost','Kafka','Redis','FastAPI','Grafana']],
    ['job_ocr_invoice','Fine-tune mô hình OCR nhận dạng hóa đơn tiếng Việt','u_client','NLP / OCR',2800,'3 tuần','Pro','open',['TrOCR','PaddleOCR','Python','FastAPI']],
    ['job_social_agent','Xây dựng AI Agent tự động đăng bài Facebook/Instagram cho SME','u_client2','AI Agent',1800,'2 tuần','Starter','open',['LangGraph','Meta API','Canva API','Python']],
    ['job_sales_insight','Dashboard phân tích dữ liệu bán hàng với AI insight tự động','u_client','Data Analytics / AI',4100,'4 tuần','Pro','open',['Python','Pandas','Plotly','OpenAI API','Next.js']],
    ['job_legal_summary','Hệ thống tóm tắt văn bản pháp lý tự động (Legal AI)','u_enterprise','LLM / Legal',6500,'6 tuần','Enterprise','pending_approval',['RAG','LangChain','Vietnamese NLP','Vector DB']],
    ['job_face_attendance','Nhận diện khuôn mặt và chấm công tự động cho nhà máy','u_client3','Computer Vision',5000,'5 tuần','Pro','open',['FaceNet','InsightFace','OpenCV','FastAPI','React']],
    ['job_stock_signal','Bot giao dịch chứng khoán semi-automatic với AI signal','u_client','AI / FinTech',7800,'7 tuần','Enterprise','draft',['Python','TA-Lib','LLM','Backtrader','Telegram Bot']],
    ['job_mlops_pipeline','Dịch vụ MLOps: setup pipeline CI/CD cho team AI 10 người','u_enterprise','MLOps',5500,'4 tuần','Enterprise','open',['MLflow','DVC','GitHub Actions','Docker','Weights&Biases']],
    ['job_ner_dataset','Tạo bộ dataset tiếng Việt cho bài toán Named Entity Recognition','u_client','Data & Annotation',1500,'2 tuần','Starter','open',['Label Studio','Python','Doccano','Vietnamese NLP']],
    ['job_hr_chatbot','Chatbot tuyển dụng tự động sàng lọc CV và phỏng vấn vòng 1','u_enterprise','HR AI / LLM',3800,'3 tuần','Pro','open',['LangChain','GPT-4','PDF parsing','REST API']],
    ['job_plant_mobile','App mobile AI nhận diện bệnh cây trồng qua ảnh chụp','u_client4','Computer Vision / AgriTech',4200,'5 tuần','Pro','in_progress',['EfficientNet','React Native','FastAPI','Firebase']],
    ['job_movie_recommend','Hệ thống recommend phim/series cho OTT platform nội địa','u_enterprise','Recommendation System',8000,'8 tuần','Enterprise','open',['Collaborative Filtering','Python','Redis','Airflow']],
    ['job_voice_iot','Tích hợp AI voice assistant tiếng Việt vào thiết bị IoT','u_client3','NLP / Voice AI',6000,'6 tuần','Enterprise','open',['Whisper','TTS','Rasa','MQTT','Raspberry Pi']],
    ['job_support_ticket','Phân loại ticket hỗ trợ khách hàng bằng AI tiếng Việt','u_client','NLP / Classification',2200,'3 tuần','Starter','open',['PhoBERT','FastAPI','Text Classification']],
    ['job_video_summary','Tóm tắt video đào tạo nội bộ thành checklist hành động','u_enterprise','Multimodal AI',4700,'4 tuần','Pro','open',['Whisper','LLM','Next.js','S3']],
    ['job_price_forecast','Dự báo nhu cầu và giá tồn kho cho chuỗi bán lẻ','u_client2','Forecasting',5200,'5 tuần','Pro','open',['Prophet','XGBoost','Pandas','PowerBI']],
    ['job_quality_voice','AI đánh giá chất lượng cuộc gọi tổng đài','u_client3','Speech Analytics',4400,'4 tuần','Pro','open',['Whisper','Sentiment Analysis','FastAPI','Dashboard']],
    ['job_doc_redaction','Tự động che thông tin nhạy cảm trong tài liệu PDF','u_enterprise','Document AI / Security',3600,'3 tuần','Pro','open',['OCR','NER','PDF','Security']],
  ];
  const insertedJobs = await db.collection('jobs').insertMany(jobDefs.map(([alias,title,clientAlias,category,budget,duration,level,status,skills]) => ({
    title, clientId: users[String(clientAlias)], enterpriseId: clientAlias === 'u_enterprise' ? 'ent_nova' : '', category, skills, budget, currency: 'USD', duration, level, status,
    description: `Dự án ${title}. Yêu cầu triển khai production, có milestone, tài liệu, nghiệm thu và bàn giao rõ ràng.`, aiBrief: 'AI brief: chia thành discovery, prototype/eval và production handover.', proposalIds: [], viewCount: Math.floor(Math.random()*40)+5, isRemote: true, createdAt: now(), updatedAt: now()
  })));
  const jobs: AliasMap = {}; jobDefs.forEach(([alias], i) => jobs[String(alias)] = String(insertedJobs.insertedIds[i]));

  const cover = 'Tôi đã triển khai dự án tương tự trong môi trường production, có quy trình nghiệm thu rõ ràng, báo cáo kỹ thuật và handover. Tôi có thể bắt đầu ngay, chia thành các milestone nhỏ để Client kiểm soát tiến độ.';
  const proposalDefs = [
    ['prop_001','job_logistics_chatbot','u_expert',4300,'24 ngày','shortlisted',95], ['prop_002','job_ecom_ai','u_expert2',3200,'26 ngày','pending',86], ['prop_003','job_ocr_invoice','u_expert4',2500,'18 ngày','accepted',91], ['prop_004','job_face_attendance','u_expert2',4650,'32 ngày','accepted',94], ['prop_005','job_social_agent','u_expert5',1600,'12 ngày','accepted',90], ['prop_006','job_logistics_chatbot','u_expert5',4100,'28 ngày','pending',83], ['prop_007','job_sales_insight','u_expert3',3700,'22 ngày','pending',82], ['prop_008','job_mlops_pipeline','u_expert3',5000,'25 ngày','shortlisted',96], ['prop_009','job_ner_dataset','u_expert4',1350,'11 ngày','pending',89], ['prop_010','job_face_attendance','u_expert3',4550,'35 ngày','rejected',78], ['prop_011','job_ecom_ai','u_expert5',3000,'24 ngày','pending',84], ['prop_012','job_fraud_ml','u_expert3',8300,'7 tuần','pending',88], ['prop_013','job_hr_chatbot','u_expert',3400,'20 ngày','pending',87], ['prop_014','job_ocr_invoice','u_expert2',2650,'20 ngày','pending',80], ['prop_015','job_plant_mobile','u_expert2',3900,'30 ngày','accepted',92]
  ];
  const insertedProps = await db.collection('proposals').insertMany(proposalDefs.map(([alias,jobAlias,expertAlias,rate,eta,status,score]) => ({ jobId: jobs[String(jobAlias)], expertId: users[String(expertAlias)], coverLetter: cover, rate, currency: 'USD', eta, status, score, attachmentUrls: [], createdAt: now(), updatedAt: now() })));
  const props: AliasMap = {}; proposalDefs.forEach(([alias], i) => props[String(alias)] = String(insertedProps.insertedIds[i]));
  for (let i = 0; i < proposalDefs.length; i++) {
    const jobAlias = String(proposalDefs[i][1]);
    const propAlias = String(proposalDefs[i][0]);
    await db.collection('jobs').updateOne({ _id: new mongoose.Types.ObjectId(jobs[jobAlias]) }, { $push: { proposalIds: props[propAlias] } as any });
  }

  const contractDefs = [
    ['ctr_logistics_rag','job_logistics_chatbot','prop_001','u_client3','u_expert','RAG Chatbot logistics',4300,'active',65],
    ['ctr_fashion_ai','job_ecom_ai','prop_002','u_client2','u_expert2','Website bán thời trang AI',3200,'active',30],
    ['ctr_ocr_vn','job_ocr_invoice','prop_003','u_client','u_expert4','OCR hóa đơn tiếng Việt',2500,'completed',100],
    ['ctr_face_factory','job_face_attendance','prop_004','u_client3','u_expert2','Computer Vision chấm công',4650,'disputed',55],
    ['ctr_social_agent','job_social_agent','prop_005','u_client2','u_expert5','AI Agent social media',1600,'active',80],
  ];
  const insertedContracts = await db.collection('contracts').insertMany(contractDefs.map(([alias,jobAlias,propAlias,clientAlias,expertAlias,title,totalBudget,status,progress]) => ({ jobId: jobs[String(jobAlias)], proposalId: props[String(propAlias)], clientId: users[String(clientAlias)], expertId: users[String(expertAlias)], title, totalBudget, currency: 'USD', escrowAmount: totalBudget, releasedAmount: Math.round(Number(totalBudget)*Number(progress)/100), status, privacy: 'public', progress, milestoneIds: [], terms: 'Escrow milestone, private delivery policy, dispute resolution by Admin.', createdAt: now(), updatedAt: now() })));
  const contracts: AliasMap = {}; contractDefs.forEach(([alias], i) => contracts[String(alias)] = String(insertedContracts.insertedIds[i]));

  const msStatuses = ['approved','submitted','pending']; const milestoneDocs: any[] = [];
  contractDefs.forEach(([alias,,,,,title,total]) => { [1,2,3].forEach((order) => milestoneDocs.push({ contractId: contracts[String(alias)], title: `${title} — Milestone ${order}`, description: 'Cột mốc demo với deliverable, QA và acceptance criteria.', amount: Math.round(Number(total)/3), dueDate: `2026-07-${String(5+order*5).padStart(2,'0')}`, status: msStatuses[order-1], deliverable: order<3?'Báo cáo kỹ thuật + link demo':'', order, createdAt: now(), updatedAt: now(), submittedAt: order===2?now():null, approvedAt: order===1?now():null })); });
  await db.collection('milestones').insertMany(milestoneDocs);

  const txnDocs: any[] = [];
  contractDefs.forEach(([alias,,,,expertAlias,title,total]) => { txnDocs.push({ userId: users[contractDefs.find(c=>c[0]===alias)![3] as string], contractId: contracts[String(alias)], type:'deposit', amount: Number(total), currency:'USD', status:'completed', note:`Nạp escrow ${title}`, createdAt: now() }); txnDocs.push({ userId: users[String(expertAlias)], contractId: contracts[String(alias)], type:'milestone_release', amount: Math.round(Number(total)/3), currency:'USD', status:'completed', note:`Giải ngân milestone 1 ${title}`, createdAt: now() }); });
  txnDocs.push({ userId: users.u_expert, type:'withdrawal', amount:500, currency:'USD', status:'pending', note:'Rút tiền về ngân hàng', createdAt: now() }, { userId: users.u_client3, contractId: contracts.ctr_face_factory, type:'refund', amount:350, currency:'USD', status:'completed', note:'Hoàn tiền do dispute', createdAt: now() });
  while (txnDocs.length < 20) txnDocs.push({ userId: users.u_admin, type:'platform_fee', amount:100+txnDocs.length*10, currency:'USD', status:'completed', note:'Doanh thu nền tảng demo', createdAt: now() });
  await db.collection('transactions').insertMany(txnDocs.slice(0,20));

  await db.collection('disputes').insertMany([
    { contractId: contracts.ctr_face_factory, openedBy: users.u_client3, reason:'Accuracy ánh sáng yếu chưa đạt cam kết nghiệm thu.', description:'Cần benchmark bổ sung trước khi giải ngân.', evidence:['night-shift.zip','accuracy.pdf'], status:'mediation', decision:'Admin yêu cầu Expert bổ sung evidence.', resolution:'pending', createdAt: now() },
    { contractId: contracts.ctr_social_agent, openedBy: users.u_client2, reason:'Cần xác nhận quyền truy cập Meta API.', evidence:['meta-permission.png'], status:'open', createdAt: now() },
  ]);
  await db.collection('notifications').insertMany(Array.from({length:15}, (_,i) => ({ userId: [users.u_client,users.u_expert,users.u_admin,users.u_enterprise,users.u_client2,users.u_client3][i%6], title: ['Milestone được duyệt','Có proposal mới','Tranh chấp mới','Job cần phê duyệt','Có tin nhắn mới'][i%5], body: 'Thông báo demo đồng bộ theo workflow AITasker.', tone: ['success','info','warning','info','info'][i%5], read: i%3===0, link: '/', entityType:'demo', entityId:String(i), createdAt: now() })));
  await db.collection('reviews').insertMany(Array.from({length:8}, (_,i) => ({ contractId: Object.values(contracts)[i%5], fromUserId: [users.u_client,users.u_client2,users.u_client3][i%3], toUserId: [users.u_expert,users.u_expert2,users.u_expert4,users.u_expert5][i%4], rating: i%3===0?4:5, body: ['An làm việc rất chuyên nghiệp, code sạch, có document đầy đủ.','Linh giao hàng đúng hạn, model accuracy tốt hơn benchmark đề ra.','Chất lượng ổn nhưng cần nhiều vòng revise hơn mong đợi.'][i%3], communicationRating: 5, qualityRating: i%3===0?4:5, timelinessRating: i%2?5:4, createdAt: now() })));
  await db.collection('messages').insertMany(Array.from({length:20}, (_,i) => ({ contractId: Object.values(contracts)[i%5], senderId: i%2?users.u_expert:users.u_client3, body: ['Anh ơi, phần OCR với hóa đơn VAT dạng scan mờ thì accuracy đang bao nhiêu %?','Hiện đang 87% trên test set, em đang augment thêm ảnh mờ để improve.','Tốt, anh cần thêm support cho hóa đơn có seal/con dấu nhé.','Dạ, em sẽ thêm vào sprint 2.'][i%4], kind: i%7===0?'code':'text', flagged:false, createdAt: now() })));
  await db.collection('auditlogs').insertMany(Array.from({length:10}, (_,i) => ({ actorId: users.u_admin, action: ['verification.approved','user.block','dispute.mediation','platform.settings.update'][i%4], targetId: `target_${i}`, metadata: 'Audit log demo cho vận hành hệ thống.', createdAt: now() })));

  console.log('✅ Seed hoàn tất!');
  console.log('   Admin:      admin@aitasker.dev / demo1234');
  console.log('   Client:     client@aitasker.dev / demo1234');
  console.log('   Expert:     expert@aitasker.dev / demo1234');
  console.log('   Enterprise: enterprise@aitasker.dev / demo1234');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error('❌ Seed lỗi:', e); process.exit(1); });
