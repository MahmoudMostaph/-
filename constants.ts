
import { Product } from './types';

/**
 * رقم الواتساب الموحد للمركز (بدون علامة +)
 */
export const CONTACT_WHATSAPP = '966580154064';

/**
 * تنبيه أمني: كلمة المرور هذه مخزنة في كود المتصفح (Client-side).
 * هي كافية لمنع الزوار العاديين من الدخول للوحة التحكم، 
 * ولكنها ليست حماية ضد الاختراق المتقدم.
 */
export const ADMIN_PASSWORD = '01146554181';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Muscle Mass Gainer',
    description: 'تركيبة متقدمة لزيادة الوزن والكتلة العضلية بفعالية. غني بالبروتين والسعرات الحرارية لدعم نمو العضلات.',
    imageUrl: 'https://picsum.photos/seed/gainer/400/400',
    price: 280,
    salePrice: 249,
    category: 'athlete',
    stock: 15,
  },
  {
    id: '2',
    name: 'Creatine Monohydrate',
    description: 'كرياتين نقي لتعزيز القوة والأداء البدني أثناء التمارين عالية الكثافة. يساعد على زيادة حجم العضلات.',
    imageUrl: 'https://picsum.photos/seed/creatine/400/400',
    price: 120,
    category: 'athlete',
    stock: 20,
  },
  {
    id: '3',
    name: 'Critical Oats Protein Porridge',
    description: 'وجبة إفطار مثالية للرياضيين. شوفان بالبروتين سهل التحضير وغني بالألياف لصباح مليء بالأناقة.',
    imageUrl: 'https://picsum.photos/seed/oats/400/400',
    price: 95,
    category: 'athlete',
    stock: 10,
  },
  {
    id: '4',
    name: 'Clear Whey Protein',
    description: 'بروتين مصل اللبن الصافي والمنعش. بديل خفيف للعصائر البروتينية التقليدية، مثالي بعد التمرين.',
    imageUrl: 'https://picsum.photos/seed/whey/400/400',
    price: 190,
    salePrice: 175,
    category: 'slimming',
    stock: 5,
  },
  {
    id: '5',
    name: 'ISO-XP Whey Isolate',
    description: 'بروتين مصل اللبن المعزول عالي النقاء وسريع الامتصاص. خالٍ من السكر والدهون لدعم بناء العضلات الصافية.',
    imageUrl: 'https://picsum.photos/seed/isoxp/400/400',
    price: 220,
    category: 'slimming',
    stock: 8,
  }
];
