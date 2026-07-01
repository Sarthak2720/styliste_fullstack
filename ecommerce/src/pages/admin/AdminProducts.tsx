// import { useState, useEffect } from 'react';
// // Add FiPause and FiPlay to your imports
// // import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid} from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// // This points to your Spring Boot Server
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   // 🔧 VIDEO FILE HANDLING
// const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
// const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);

//   //File Handling
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });
// // 🔧 SIZE & COLOR
// const [sizesInput, setSizesInput] = useState('');
// const [colorsInput, setColorsInput] = useState('');

//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- HELPER: RESOLVE IMAGE URL ---
//   // This logic ensures we load images from the correct server
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path; // Already absolute or local blob
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };
// const [activeAction, setActiveAction] =
//   useState<'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT' | null>(null);

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);
// // 🔧 VIDEO FILE CHANGE
// const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files && e.target.files.length > 0) {
//     const files = Array.from(e.target.files);
//     setSelectedVideos(prev => [...prev, ...files]);
//     const previews = files.map(file => URL.createObjectURL(file));
//     setVideoPreviewUrls(prev => [...prev, ...previews]);
//   }
// };

// const removeVideo = (index: number) => {
//   setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//   setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
// };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 50),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(prodRes.content);
//       setCategories(catRes);
//     } catch (error: any) {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- MODAL OPENERS ---
//   const openProductModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         salePrice: product.salePrice || 0,
//         stock: product.stock,
//         category: product.category,
//         subcategory: product.subcategory,
//         images: product.images,
//         videos: product.videos || [],
//         attributes: product.attributes,
//       });
//       // ✅ ADD THESE TWO LINES HERE
//   setSizesInput(
//     product.attributes?.find((a: any) => a.key === 'size')?.value || ''
//   );
//   setColorsInput(
//     product.attributes?.find((a: any) => a.key === 'color')?.value || ''
//   );
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//   setColorsInput('');

//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = () => {
//     setCategoryForm({ name: '', description: '' });
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = () => {
//     setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setActiveAction(null);
//     setSelectedVideos([]);
// setVideoPreviewUrls([]);
// setSizesInput('');
//   setColorsInput('');
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT: PRODUCT ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       // 1. JSON Part
//       const productBlob = new Blob([JSON.stringify(productForm)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       // 2. File Part
//       selectedFiles.forEach((file) => {
//         formData.append('imageFiles', file);
//       });
// // 🔧 VIDEO FILES
// selectedVideos.forEach((video) => {
//   formData.append('videoFiles', video);
// });

//       if (editingProduct) {
//         // NOTE: Update logic needs backend support for Multipart PUT.
//         // For now, we just update text data if no files selected,
//         // or you need to update backend PUT endpoint similarly to POST.
//         await productApi.updateProduct(editingProduct.id, productForm);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created with images!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to create product.');
//     }
//   };

//   // --- FORM SUBMIT: CATEGORY ---
//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");
//     try {
//       const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//       setCategories([...categories, newCat]);
//       toast.success(`Category '${newCat.name}' created`);
//       closeModal();
//     } catch (error) {
//       toast.error("Failed to create category");
//     }
//   };

//   // --- FORM SUBMIT: SUBCATEGORY ---
//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");
//     try {
//       const parentId = Number(subCatForm.parentCategoryId);
//       const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);

//       const updatedCats = categories.map(c =>
//         c.id === parentId
//           ? { ...c, subCategories: [...c.subCategories, newSub] }
//           : c
//       );
//       setCategories(updatedCats);
//       toast.success(`Subcategory '${newSub.name}' added`);
//       closeModal();
//     } catch (error) {
//       toast.error("Failed to create subcategory");
//     }
//   };

//   // --- HANDLERS ---
//   const handleDelete = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Deleted');
//       fetchData();
//     } catch (error) { toast.error('Failed'); }
//   };

// // --- HANDLER: TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         // If currently Active -> Deactivate it
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         // If currently Inactive -> Activate it
//         // Note: We need to ensure this API exists (see Step 3)
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData(); // Refresh the grid to show the new state
//     } catch (error) {
//       toast.error('Failed to update status');
//     }
//   };

//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   const addImageUrl = () => {
//     const url = prompt('Enter image URL:');
//     if (url) setProductForm(prev => ({ ...prev, images: [...prev.images, url] }));
//   };

//   const removeImage = (index: number) => {
//     setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
//   };

//   const availableSubCategories = categories.find(c => c.name === productForm.category)?.subCategories || [];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Product Management</h2>
// <p className="text-dark-600 mt-1">{products.length} products total</p>
//         </div>
//         <div className="flex space-x-3">
//           <motion.button
//   whileHover={{ scale: 1.05 }}
//   whileTap={{ scale: 0.95 }}
//   onClick={() => {
//     setActiveAction('CATEGORY');
//     openCategoryModal();
//   }}
//   className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all
//     ${
//       activeAction === 'CATEGORY'
//         ? 'bg-[#8FAE8B] text-white shadow-sm'
//         : 'glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50'
//     }
//   `}
// >
//   <FiFolder />
//   <span>Add Category</span>
// </motion.button>
// <motion.button
//   whileHover={{ scale: 1.05 }}
//   whileTap={{ scale: 0.95 }}
//   onClick={() => {
//     setActiveAction('SUBCATEGORY');
//     openSubCategoryModal();
//   }}
//   className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all
//     ${
//       activeAction === 'SUBCATEGORY'
//         ? 'bg-[#8FAE8B] text-white shadow-sm'
//         : 'glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50'
//     }
//   `}
// >
//   <FiGrid />
//   <span>Add Subcategory</span>
// </motion.button>
// <motion.button
//   whileHover={{ scale: 1.05 }}
//   whileTap={{ scale: 0.95 }}
//   onClick={() => {
//     setActiveAction('PRODUCT');
//     openProductModal();
//   }}
//   className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all
//     ${
//       activeAction === 'PRODUCT'
//         ? 'bg-[#8FAE8B] text-white shadow-sm'
//         : 'glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50'
//     }
//   `}
// >
//   <FiPlus />
//   <span>Add Product</span>
// </motion.button>

//         </div>
//       </div>

//       {/* --- GRID --- */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{/* Shimmers */}</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product) => (
//             <motion.div key={product.id} whileHover={{ y: -4 }} className="glass-card-hover rounded-2xl overflow-hidden ring-1 ring-[#8FAE8B]">
//               <div className="aspect-square bg-dark-900 relative">
//                 {/* ✅ FIX 1: Use getImageUrl for the Main Grid Image */}
//                 <img
//                   src={getImageUrl(product.images[0])}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                   // onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.jpg'}
//                 />
//                 {!product.isActive && (
//                   <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center">
//                     <span className="px-4 py-2 bg-red-500 text-dark-900 font-semibold rounded-lg">Inactive</span>
//                   </div>
//                 )}
//               </div>
//               <div className="p-4 space-y-3">
//                 <h3 className="text-lg font-semibold text-dark-900 line-clamp-1">{product.name}</h3>
//                 <div className="flex space-x-2 text-xs text-dark-400">
//                     <span className="px-2 py-0.5 bg-dark-800 rounded">{product.category}</span>
//                     <span className="px-2 py-0.5 bg-dark-800 rounded">{product.subcategory}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-xl font-bold gradient-text">${product.price.toFixed(2)}</p>
//                   <span className="px-3 py-1 bg-primary-50 text-dark-700 text-sm rounded-lg">Stock: {product.stock}</span>
//                 </div>
// <div className="flex items-center space-x-2 pt-2 border-t border-dark-200">

//   {/* Edit Button */}
//   <button onClick={() => openProductModal(product)} className="flex-1 p-2 hover:bg-primary-50 ring-1 ring-[#8FAE8B] rounded transition-colors" title="Edit">
//     <FiEdit2 className="mx-auto text-primary-400" />
//   </button>

//   {/* ✅ THE NEW TOGGLE BUTTON */}
//   <button
//     onClick={() => handleToggleStatus(product.id, product.isActive)}
//     className={`flex-1 p-2 rounded transition-colors group/status ${
//       product.isActive
//         ? "hover:bg-orange-500/10" // Hover effect for Active
//         : "hover:bg-green-500/10"  // Hover effect for Inactive
//     }`}
//     title={product.isActive ? "Deactivate Product" : "Activate Product"}
//   >
//     {product.isActive ? (
//       // If Active: Show Pause Icon (Orange)
//       <FiPause className="mx-auto text-orange-400 group-hover/status:text-orange-300" />
//     ) : (
//       // If Inactive: Show Play Icon (Green)
//       <FiPlay className="mx-auto text-green-400 group-hover/status:text-green-300" />
//     )}
//   </button>

//   {/* Delete Button */}
//   <button onClick={() => handleDelete(product.id)} className="flex-1 p-2 hover:bg-primary-50 ring-1 ring-[#8FAE8B] rounded transition-colors" title="Delete">
//     <FiTrash2 className="mx-auto text-red-400" />
//   </button>

// </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* MODAL 1: PRODUCT */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     {/* Inputs... */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div><label className="label">Product Name *</label><input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required /></div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
//                             </select>
//                         </div>
//                         <div><label className="label">Stock *</label><input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/></div>
//                         {/* ================= SIZE & COLOUR ================= */}
// {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
//   <div>
//     <label className="label">Sizes</label>
//     <input
//       type="text"
//       value={sizesInput}
//       onChange={(e) => setSizesInput(e.target.value)}
//       placeholder="S, M, L, XL"
//       className="input-field"
//     />
//     <p className="text-xs text-dark-400 mt-1">
//       Enter sizes separated by commas
//     </p>
//   </div>

//   <div>
//     <label className="label">Colours</label>
//     <input
//       type="text"
//       value={colorsInput}
//       onChange={(e) => setColorsInput(e.target.value)}
//       placeholder="Red, Black, Blue"
//       className="input-field"
//     />
//     <p className="text-xs text-dark-400 mt-1">
//       Enter colours separated by commas
//     </p>
//   </div>

//                         <div><label className="label">Price *</label><input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/></div>
//                         <div><label className="label">Sale Price</label><input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/></div>
//                     </div>
//                     <div><label className="label">Description *</label><textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required /></div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {/* ✅ FIX 2: Use getImageUrl for Existing Images in Modal */}
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {/* New Previews (Blob URLs don't need getImageUrl) */}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
// {/* ================= VIDEOS ================= */}
// <div>
//   <label className="label">Product Videos</label>

//   <div className="flex items-center justify-center w-full mb-4">
//     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//         <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//         <p className="text-sm text-dark-400">
//           <span className="font-semibold">Click or drag videos</span>
//         </p>
//       </div>
//       <input
//         type="file"
//         className="hidden"
//         multiple
//         accept="video/*"
//         onChange={handleVideoChange}
//       />
//     </label>
//   </div>

//   <div className="grid grid-cols-4 gap-2">
//     {videoPreviewUrls.map((url, index) => (
//       <div
//         key={index}
//         className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden"
//       >
//         <video
//           src={url}
//           className="w-full h-full object-cover"
//           muted
//         />
//         <button
//           type="button"
//           onClick={() => removeVideo(index)}
//           className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"
//         >
//           <FiX size={12} />
//         </button>
//       </div>
//     ))}
//   </div>
// </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* MODAL 2: CATEGORY */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-dark-900">Add New Category</h2><button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button></div>
//                     <div><label className="label">Category Name *</label><input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/></div>
//                     <div><label className="label">Description</label><textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/></div>
//                     <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary flex-1">Create Category</button><button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button></div>
//                   </form>
//                 )}

//                 {/* MODAL 3: SUBCATEGORY */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-dark-900">Add New Subcategory</h2><button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button></div>
//                     <div>
//                         <label className="label">Parent Category *</label>
//                         <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                             <option value="">Select Parent Category</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                         </select>
//                     </div>
//                     <div><label className="label">Subcategory Name *</label><input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/></div>
//                     <div><label className="label">Description</label><textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/></div>
//                     <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary flex-1">Create Subcategory</button><button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button></div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//       <style>{`.label { @apply text-sm font-semibold text-dark-700 mb-2 block; }`}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- SEARCH/FILTER STATE ---
//   const [categorySearch, setCategorySearch] = useState('');
//   const [subCategorySearch, setSubCategorySearch] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL');

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(prodRes.content || prodRes);
//       setCategories(catRes);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- FILTERED DATA ---
//   const filteredCategories = categories.filter(cat =>
//     cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
//     cat.description?.toLowerCase().includes(categorySearch.toLowerCase())
//   );

//   const subCategoryRows = categories.flatMap(cat =>
//     cat.subCategories.map(sub => ({
//       ...sub,
//       parentName: cat.name,
//       parentId: cat.id
//     }))
//   );

//   const filteredSubCategories = subCategoryRows.filter(sub =>
//     sub.name.toLowerCase().includes(subCategorySearch.toLowerCase()) ||
//     sub.parentName.toLowerCase().includes(subCategorySearch.toLowerCase())
//   );

//   const filteredProducts = products.filter(prod => {
//     const matchesSearch =
//       prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
//       prod.description?.toLowerCase().includes(productSearch.toLowerCase());

//     const matchesStatus =
//       statusFilter === 'ALL' ||
//       (statusFilter === 'ACTIVE' && prod.isActive) ||
//       (statusFilter === 'INACTIVE' && !prod.isActive);

//     return matchesSearch && matchesStatus;
//   });

//   // --- MODAL HANDLERS ---
//   const openProductModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         salePrice: product.salePrice || 0,
//         stock: product.stock,
//         category: product.category,
//         subcategory: product.subcategory,
//         images: product.images,
//         videos: product.videos || [],
//         attributes: product.attributes,
//       });
//       setSizesInput(product.attributes?.find((a: any) => a.key === 'size')?.value || '');
//       setColorsInput(product.attributes?.find((a: any) => a.key === 'color')?.value || '');
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name, description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId.toString(),
//         name: subCategory.name,
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       // Update attributes with sizes and colors
//       const updatedAttributes = [];
//       if (sizesInput.trim()) {
//         updatedAttributes.push({ key: 'size', value: sizesInput });
//       }
//       if (colorsInput.trim()) {
//         updatedAttributes.push({ key: 'color', value: colorsInput });
//       }

//       const productData = {
//         ...productForm,
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         // Check if updateCategory exists in your API
//         const updated = await categoryApi.updateCategory(editingCategory.id, categoryForm.name, categoryForm.description);
//         setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c));
//         toast.success(`Category '${updated.name}' updated`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories([...categories, newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         // Check if updateSubCategory exists in your API
//         const updated = await categoryApi.updateSubCategory(editingSubCategory.id, subCatForm.name, subCatForm.description);
//         const updatedCats = categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: c.subCategories.map(sc => sc.id === editingSubCategory.id ? updated : sc) }
//             : c
//         );
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${updated.name}' updated`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...c.subCategories, newSub] }
//             : c
//         );
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       // Check if deleteCategory exists in your API
//       await categoryApi.deleteCategory(id);
//       toast.success('Category deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       // Check if deleteSubCategory exists in your API
//       await categoryApi.deleteSubCategory(id);
//       toast.success('Subcategory deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   const availableSubCategories = categories.find(c => c.name === productForm.category)?.subCategories || [];

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   const paginatedSubCategories = filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   const paginatedProducts = filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   const totalPages = Math.ceil(
//     activeTab === 'CATEGORY' ? filteredCategories.length / rowsPerPage :
//     activeTab === 'SUBCATEGORY' ? filteredSubCategories.length / rowsPerPage :
//     filteredProducts.length / rowsPerPage
//   );

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Product Management</h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts.length} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories.length} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories.length} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiFolder />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiGrid />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiPlus />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-dark-200">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'PRODUCT' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'CATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BARS --- */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         {activeTab === 'CATEGORY' && (
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder="Search categories..."
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={categorySearch}
//               onChange={(e) => setCategorySearch(e.target.value)}
//             />
//           </div>
//         )}

//         {activeTab === 'SUBCATEGORY' && (
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder="Search subcategories..."
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={subCategorySearch}
//               onChange={(e) => setSubCategorySearch(e.target.value)}
//             />
//           </div>
//         )}

//         {activeTab === 'PRODUCT' && (
//           <div className="flex space-x-4">
//             <div className="flex-1 flex items-center space-x-2">
//               <FiSearch className="text-dark-400" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="flex-1 p-2 border-none focus:outline-none"
//                 value={productSearch}
//                 onChange={(e) => setProductSearch(e.target.value)}
//               />
//             </div>
//             <select
//               className="p-2 border border-dark-200 rounded"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="ALL">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="INACTIVE">Inactive</option>
//             </select>
//           </div>
//         )}
//       </div>

//       {/* --- DATA TABLES --- */}
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           {/* CATEGORY TABLE */}
//           {activeTab === 'CATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedCategories.map((category, index) => (
//                     <tr key={category.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {(page - 1) * rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                         {category.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-dark-900">
//                         {category.description || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openCategoryModal(category)}
//                             className="text-primary-600 hover:text-primary-900"
//                           >
//                             <FiEdit2 />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteCategory(category.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* SUBCATEGORY TABLE */}
//           {activeTab === 'SUBCATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedSubCategories.map((sub, index) => (
//                     <tr key={sub.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {(page - 1) * rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                         {sub.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {sub.parentName}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-dark-900">
//                         {sub.description || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openSubCategoryModal(sub)}
//                             className="text-primary-600 hover:text-primary-900"
//                           >
//                             <FiEdit2 />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteSubCategory(sub.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* PRODUCT TABLE */}
//           {activeTab === 'PRODUCT' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Image</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedProducts.map((product, index) => (
//                     <tr key={product.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {(page - 1) * rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="h-10 w-10 rounded overflow-hidden">
//                           <img
//                             src={getImageUrl(product.images[0])}
//                             alt={product.name}
//                             className="h-full w-full object-cover"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                         {product.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {product.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {product.subcategory}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                           {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openProductModal(product)}
//                             className="text-blue-600 hover:text-blue-900"
//                             title="View"
//                           >
//                             <FiEye />
//                           </button>
//                           <button
//                             onClick={() => openProductModal(product)}
//                             className="text-primary-600 hover:text-primary-900"
//                             title="Edit"
//                           >
//                             <FiEdit2 />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(product.id, product.isActive)}
//                             className={product.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
//                             title={product.isActive ? "Deactivate" : "Activate"}
//                           >
//                             {product.isActive ? <FiPause /> : <FiPlay />}
//                           </button>
//                           <button
//                             onClick={() => handleDeleteProduct(product.id)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* --- PAGINATION --- */}
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                 disabled={page === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium rounded-md text-dark-700 bg-white hover:bg-dark-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={page === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-dark-300 text-sm font-medium rounded-md text-dark-700 bg-white hover:bg-dark-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-dark-700">
//                   Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(
//                       page * rowsPerPage,
//                       activeTab === 'CATEGORY' ? filteredCategories.length :
//                       activeTab === 'SUBCATEGORY' ? filteredSubCategories.length :
//                       filteredProducts.length
//                     )}
//                   </span>{' '}
//                   of{' '}
//                   <span className="font-medium">
//                     {activeTab === 'CATEGORY' ? filteredCategories.length :
//                      activeTab === 'SUBCATEGORY' ? filteredSubCategories.length :
//                      filteredProducts.length}
//                   </span>{' '}
//                   results
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                           : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* PRODUCT MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter sizes separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter colours separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VIDEOS SECTION */}
//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//                             <p className="text-sm text-dark-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                         <option value="">Select Parent Category</option>
//                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-dark-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

// const fetchData = async () => {
//   setLoading(true);
//   try {
//     const [prodRes, catRes] = await Promise.all([
//       productApi.getAllProducts(0, 1000),
//       categoryApi.getAllCategories()
//     ]);
//     // Ensure products is always an array
//     setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                 Array.isArray(prodRes) ? prodRes : []);
//     setCategories(Array.isArray(catRes) ? catRes : []);
//   } catch (error: any) {
//     console.error('Error fetching data:', error);
//     toast.error('Failed to load data');
//     setProducts([]); // Set to empty array on error
//     setCategories([]);
//   } finally {
//     setLoading(false);
//   }
// };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories.length) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     return categories.flatMap(cat =>
//       cat.subCategories.map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id); // Newest first
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       sub.parentName.toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

// const filteredProducts = useMemo(() => {
//   // Add null/undefined check here
//   if (!products || !Array.isArray(products)) return [];

//   return products
//     .filter(prod => {
//       const matchesItem = prod.name.toLowerCase().includes(columnFilters.item.toLowerCase());
//       const matchesSubcategory = prod.subcategory.toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//       const matchesCategory = prod.category.toLowerCase().includes(columnFilters.category.toLowerCase());
//       const matchesStatus =
//         columnFilters.status === '' ||
//         (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//         (columnFilters.status === 'INACTIVE' && !prod.isActive);

//       return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//     })
//     .sort((a, b) => b.id - a.id); // Newest first
// }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

// const paginatedProducts = useMemo(() => {
//   if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//   return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
// }, [filteredProducts, page, rowsPerPage]);

//  const totalPages = useMemo(() => {
//   const itemCount =
//     activeTab === 'CATEGORY' ? filteredCategories.length :
//     activeTab === 'SUBCATEGORY' ? filteredSubCategories.length :
//     (filteredProducts?.length || 0);

//   return Math.ceil(itemCount / rowsPerPage);
// }, [activeTab, filteredCategories.length, filteredSubCategories.length, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         salePrice: product.salePrice || 0,
//         stock: product.stock,
//         category: product.category,
//         subcategory: product.subcategory,
//         images: product.images,
//         videos: product.videos || [],
//         attributes: product.attributes,
//       });
//       setSizesInput(product.attributes?.find((a: ProductAttribute) => a.key === 'size')?.value || '');
//       setColorsInput(product.attributes?.find((a: ProductAttribute) => a.key === 'color')?.value || '');
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name, description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId.toString(),
//         name: subCategory.name,
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       const updatedAttributes: ProductAttribute[] = [];
//       if (sizesInput.trim()) {
//         updatedAttributes.push({ key: 'size', value: sizesInput, type: 'TEXT' });
//       }
//       if (colorsInput.trim()) {
//         updatedAttributes.push({ key: 'color', value: colorsInput, type: 'TEXT' });
//       }

//       const productData = {
//         ...productForm,
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ));
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories([...categories, newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: c.subCategories.map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ));
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...c.subCategories, newSub] }
//             : c
//         );
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev.filter(c => c.id !== id));
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev.map(c => ({
//         ...c,
//         subCategories: c.subCategories.filter(sc => sc.id !== id)
//       })));
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1); // Reset to first page when filtering
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             {activeTab === 'PRODUCT' ? 'Product Management' :
//              activeTab === 'CATEGORY' ? 'Product Category' :
//              'Product Type'}
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts.length} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories.length} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories.length} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiFolder />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiGrid />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiPlus />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-dark-200">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'PRODUCT' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'CATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR FOR CATEGORIES/SUBCATEGORIES --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-dark-400 hover:text-dark-700"
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- DATA TABLES --- */}
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           {/* CATEGORY TABLE */}
//           {activeTab === 'CATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedCategories.map((category, index) => (
//                     <tr key={category.id} className="hover:bg-dark-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {(page - 1) * rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                         {category.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-dark-900">
//                         {category.description || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openCategoryModal(category)}
//                             className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                             title="Edit"
//                           >
//                             <FiEdit2 size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteCategory(category.id)}
//                             className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                             title="Delete"
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* SUBCATEGORY TABLE */}
//           {activeTab === 'SUBCATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedSubCategories.map((sub, index) => (
//                     <tr key={sub.id} className="hover:bg-dark-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {(page - 1) * rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                         {sub.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {sub.parentName}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-dark-900">
//                         {sub.description || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openSubCategoryModal(sub)}
//                             className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                             title="Edit"
//                           >
//                             <FiEdit2 size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteSubCategory(sub.id)}
//                             className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                             title="Delete"
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//           {activeTab === 'PRODUCT' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Item</span>
//                         <input
//                           type="text"
//                           placeholder="Search Item"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.item}
//                           onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Subcategory</span>
//                         <input
//                           type="text"
//                           placeholder="Search Subcategory"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.subcategory}
//                           onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Category</span>
//                         <input
//                           type="text"
//                           placeholder="Search Category"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.category}
//                           onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Status</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                  <tbody className="bg-white divide-y divide-dark-200">
//         {paginatedProducts && paginatedProducts.length > 0 ? (
//           paginatedProducts.map((product, index) => (
//             <tr key={product.id} className="hover:bg-dark-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0 mr-3">
//                             <img
//                               src={getImageUrl(product.images[0])}
//                               alt={product.name}
//                               className="h-10 w-10 rounded object-cover"
//                             />
//                           </div>
//                           <div className="text-sm font-medium text-dark-900">
//                             {product.name}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {product.subcategory}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                         {product.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                           {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-1">
//                           <button
//                             onClick={() => openProductModal(product)}
//                             className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                             title="View"
//                           >
//                             <FiEye size={16} />
//                           </button>
//                           <button
//                             onClick={() => openProductModal(product)}
//                             className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                             title="Edit"
//                           >
//                             <FiEdit2 size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(product.id, product.isActive)}
//                             className={`p-1 rounded hover:bg-opacity-20 ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-500" : "text-green-600 hover:text-green-900 hover:bg-green-500"}`}
//                             title={product.isActive ? "Deactivate" : "Activate"}
//                           >
//                             {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                           </button>
//                           <button
//                             onClick={() => handleDeleteProduct(product.id)}
//                             className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                             title="Delete"
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                    </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//               {loading ? 'Loading products...' : 'No products found'}
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// )}

//           {/* --- PAGINATION & ROWS PER PAGE --- */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//             <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-dark-700">Rows per page:</span>
//                 <select
//                   className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setPage(1);
//                   }}
//                 >
//                   {rowsPerPageOptions.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p className="text-sm text-dark-700">
//                   Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(
//                       page * rowsPerPage,
//                       activeTab === 'CATEGORY' ? filteredCategories.length :
//                       activeTab === 'SUBCATEGORY' ? filteredSubCategories.length :
//                       filteredProducts.length
//                     )}
//                   </span>{' '}
//                   of{' '}
//                   <span className="font-medium">
//                     {activeTab === 'CATEGORY' ? filteredCategories.length :
//                      activeTab === 'SUBCATEGORY' ? filteredSubCategories.length :
//                      filteredProducts.length}
//                   </span>{' '}
//                   results
//                 </p>
//               </div>
//             </div>

//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setPage(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       page === i + 1
//                         ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                         : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* PRODUCT MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter sizes separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter colours separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VIDEOS SECTION */}
//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//                             <p className="text-sm text-dark-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                         <option value="">Select Parent Category</option>
//                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-dark-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       // Ensure products is always an array
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//       setProducts([]); // Set to empty array on error
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id); // Newest first
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     // Add null/undefined check here
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });
//       setSizesInput(product.attributes?.find((a: ProductAttribute) => a.key === 'size')?.value || '');
//       setColorsInput(product.attributes?.find((a: ProductAttribute) => a.key === 'color')?.value || '');
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       const updatedAttributes: ProductAttribute[] = [];
//       if (sizesInput.trim()) {
//         updatedAttributes.push({ key: 'size', value: sizesInput, type: 'TEXT' });
//       }
//       if (colorsInput.trim()) {
//         updatedAttributes.push({ key: 'color', value: colorsInput, type: 'TEXT' });
//       }

//       const productData = {
//         ...productForm,
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1); // Reset to first page when filtering
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             {activeTab === 'PRODUCT' ? 'Product Management' :
//              activeTab === 'CATEGORY' ? 'Product Category' :
//              'Product Type'}
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiFolder />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiGrid />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiPlus />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-dark-200">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'PRODUCT' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'CATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR FOR CATEGORIES/SUBCATEGORIES --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-dark-400 hover:text-dark-700"
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- DATA TABLES --- */}
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           {/* CATEGORY TABLE */}
//           {activeTab === 'CATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedCategories && paginatedCategories.length > 0 ? (
//                     paginatedCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {category.name}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {category.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openCategoryModal(category)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteCategory(category.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="px-6 py-12 text-center text-dark-500">
//                         No categories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* SUBCATEGORY TABLE */}
//           {activeTab === 'SUBCATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                     paginatedSubCategories.map((sub, index) => (
//                       <tr key={sub.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {sub.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {sub.parentName}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {sub.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openSubCategoryModal(sub)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteSubCategory(sub.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                         No subcategories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//           {activeTab === 'PRODUCT' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Item</span>
//                         <input
//                           type="text"
//                           placeholder="Search Item"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.item}
//                           onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Subcategory</span>
//                         <input
//                           type="text"
//                           placeholder="Search Subcategory"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.subcategory}
//                           onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Category</span>
//                         <input
//                           type="text"
//                           placeholder="Search Category"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.category}
//                           onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Status</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedProducts && paginatedProducts.length > 0 ? (
//                     paginatedProducts.map((product, index) => (
//                       <tr key={product.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="h-10 w-10 flex-shrink-0 mr-3">
//                               <img
//                                 src={getImageUrl(product.images?.[0])}
//                                 alt={product.name}
//                                 className="h-10 w-10 rounded object-cover"
//                               />
//                             </div>
//                             <div className="text-sm font-medium text-dark-900">
//                               {product.name}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.subcategory}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.category}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => openProductModal(product)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openProductModal(product)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(product.id, product.isActive)}
//                               className={`p-1 rounded hover:bg-opacity-20 ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-500" : "text-green-600 hover:text-green-900 hover:bg-green-500"}`}
//                               title={product.isActive ? "Deactivate" : "Activate"}
//                             >
//                               {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteProduct(product.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                         {loading ? 'Loading products...' : 'No products found'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* --- PAGINATION & ROWS PER PAGE --- */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//             <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-dark-700">Rows per page:</span>
//                 <select
//                   className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setPage(1);
//                   }}
//                 >
//                   {rowsPerPageOptions.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p className="text-sm text-dark-700">
//                   Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(
//                       page * rowsPerPage,
//                       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                       (filteredProducts?.length || 0)
//                     )}
//                   </span>{' '}
//                   of{' '}
//                   <span className="font-medium">
//                     {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                      activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                      (filteredProducts?.length || 0)}
//                   </span>{' '}
//                   results
//                 </p>
//               </div>
//             </div>

//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setPage(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       page === i + 1
//                         ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                         : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* PRODUCT MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter sizes separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter colours separated by commas
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VIDEOS SECTION */}
//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//                             <p className="text-sm text-dark-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-dark-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       // Ensure products is always an array
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//       setProducts([]); // Set to empty array on error
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id); // Newest first
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     // Add null/undefined check here
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       // Extract sizes and colors from attributes
//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       setSizesInput(sizes);
//       setColorsInput(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       // Create attributes array in the format your backend expects
//       const updatedAttributes: any[] = [];

//       // Process sizes (split by comma and trim)
//       if (sizesInput.trim()) {
//         const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(s => s !== '');
//         sizesArray.forEach(size => {
//           updatedAttributes.push({ type: 'Size', value: size });
//         });
//       }

//       // Process colors (split by comma and trim)
//       if (colorsInput.trim()) {
//         const colorsArray = colorsInput.split(',').map(c => c.trim()).filter(c => c !== '');
//         colorsArray.forEach(color => {
//           updatedAttributes.push({ type: 'Color', value: color });
//         });
//       }

//       // Prepare product data matching backend structure
//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price,
//         salePrice: productForm.salePrice,
//         stock: productForm.stock,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images, // Keep existing images
//         videos: productForm.videos || [], // Add videos array
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       // Append new image files
//       selectedFiles.forEach((file) => formData.append('imageFiles', file));

//       // Append new video files
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       console.error("Error details:", error.response?.data);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1); // Reset to first page when filtering
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             {activeTab === 'PRODUCT' ? 'Product Management' :
//              activeTab === 'CATEGORY' ? 'Product Category' :
//              'Product Type'}
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiFolder />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiGrid />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiPlus />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-dark-200">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'PRODUCT' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'CATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR FOR CATEGORIES/SUBCATEGORIES --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-dark-400 hover:text-dark-700"
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- DATA TABLES --- */}
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           {/* CATEGORY TABLE */}
//           {activeTab === 'CATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedCategories && paginatedCategories.length > 0 ? (
//                     paginatedCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {category.name}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {category.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openCategoryModal(category)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteCategory(category.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="px-6 py-12 text-center text-dark-500">
//                         No categories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* SUBCATEGORY TABLE */}
//           {activeTab === 'SUBCATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                     paginatedSubCategories.map((sub, index) => (
//                       <tr key={sub.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {sub.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {sub.parentName}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {sub.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openSubCategoryModal(sub)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteSubCategory(sub.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                         No subcategories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//           {activeTab === 'PRODUCT' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Item</span>
//                         <input
//                           type="text"
//                           placeholder="Search Item"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.item}
//                           onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Subcategory</span>
//                         <input
//                           type="text"
//                           placeholder="Search Subcategory"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.subcategory}
//                           onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Category</span>
//                         <input
//                           type="text"
//                           placeholder="Search Category"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.category}
//                           onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Status</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedProducts && paginatedProducts.length > 0 ? (
//                     paginatedProducts.map((product, index) => (
//                       <tr key={product.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="h-10 w-10 flex-shrink-0 mr-3">
//                               <img
//                                 src={getImageUrl(product.images?.[0])}
//                                 alt={product.name}
//                                 className="h-10 w-10 rounded object-cover"
//                               />
//                             </div>
//                             <div className="text-sm font-medium text-dark-900">
//                               {product.name}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.subcategory}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.category}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => openProductModal(product)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openProductModal(product)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(product.id, product.isActive)}
//                               className={`p-1 rounded hover:bg-opacity-20 ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-500" : "text-green-600 hover:text-green-900 hover:bg-green-500"}`}
//                               title={product.isActive ? "Deactivate" : "Activate"}
//                             >
//                               {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteProduct(product.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                         {loading ? 'Loading products...' : 'No products found'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* --- PAGINATION & ROWS PER PAGE --- */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//             <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-dark-700">Rows per page:</span>
//                 <select
//                   className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setPage(1);
//                   }}
//                 >
//                   {rowsPerPageOptions.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p className="text-sm text-dark-700">
//                   Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(
//                       page * rowsPerPage,
//                       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                       (filteredProducts?.length || 0)
//                     )}
//                   </span>{' '}
//                   of{' '}
//                   <span className="font-medium">
//                     {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                      activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                      (filteredProducts?.length || 0)}
//                   </span>{' '}
//                   results
//                 </p>
//               </div>
//             </div>

//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setPage(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       page === i + 1
//                         ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                         : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* PRODUCT MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter sizes separated by commas (e.g., S, M, L, XL)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter colours separated by commas (e.g., Red, Black, Blue)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VIDEOS SECTION */}
//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//                             <p className="text-sm text-dark-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-dark-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT_VIEW';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       // Ensure products is always an array
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//       setProducts([]); // Set to empty array on error
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id); // Newest first
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     // Add null/undefined check here
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id); // Newest first
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal('PRODUCT_VIEW');
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       // Extract sizes and colors from attributes
//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       setSizesInput(sizes);
//       setColorsInput(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       // Create attributes array in the format your backend expects
//       const updatedAttributes: any[] = [];

//       // Process sizes (split by comma and trim)
//       if (sizesInput.trim()) {
//         const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(s => s !== '');
//         sizesArray.forEach(size => {
//           updatedAttributes.push({ type: 'Size', value: size });
//         });
//       }

//       // Process colors (split by comma and trim)
//       if (colorsInput.trim()) {
//         const colorsArray = colorsInput.split(',').map(c => c.trim()).filter(c => c !== '');
//         colorsArray.forEach(color => {
//           updatedAttributes.push({ type: 'Color', value: color });
//         });
//       }

//       // Prepare product data matching backend structure
//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price,
//         salePrice: productForm.salePrice,
//         stock: productForm.stock,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images, // Keep existing images
//         videos: productForm.videos || [], // Add videos array
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       // Append new image files
//       selectedFiles.forEach((file) => formData.append('imageFiles', file));

//       // Append new video files
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       console.error("Error details:", error.response?.data);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1); // Reset to first page when filtering
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             {activeTab === 'PRODUCT' ? 'Product Management' :
//              activeTab === 'CATEGORY' ? 'Product Category' :
//              'Product Type'}
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiFolder />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiGrid />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             <FiPlus />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-dark-200">
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'PRODUCT' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'CATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-dark-600'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR FOR CATEGORIES/SUBCATEGORIES --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center space-x-2">
//             <FiSearch className="text-dark-400" />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 p-2 border-none focus:outline-none"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-dark-400 hover:text-dark-700"
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- DATA TABLES --- */}
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           {/* CATEGORY TABLE */}
//           {activeTab === 'CATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedCategories && paginatedCategories.length > 0 ? (
//                     paginatedCategories.map((category, index) => (
//                       <tr key={category.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {category.name}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {category.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openCategoryModal(category)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteCategory(category.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="px-6 py-12 text-center text-dark-500">
//                         No categories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* SUBCATEGORY TABLE */}
//           {activeTab === 'SUBCATEGORY' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Sr. No.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subcategory Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                     paginatedSubCategories.map((sub, index) => (
//                       <tr key={sub.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {(page - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
//                           {sub.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {sub.parentName}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-dark-900">
//                           {sub.description || '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openSubCategoryModal(sub)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteSubCategory(sub.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                         No subcategories found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//           {activeTab === 'PRODUCT' && (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Item</span>
//                         <input
//                           type="text"
//                           placeholder="Search Item"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.item}
//                           onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Subcategory</span>
//                         <input
//                           type="text"
//                           placeholder="Search Subcategory"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.subcategory}
//                           onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Category</span>
//                         <input
//                           type="text"
//                           placeholder="Search Category"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                           value={columnFilters.category}
//                           onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                         />
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Stock</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Price</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>Status</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-dark-200">
//                   {paginatedProducts && paginatedProducts.length > 0 ? (
//                     paginatedProducts.map((product, index) => (
//                       <tr key={product.id} className="hover:bg-dark-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="h-10 w-10 flex-shrink-0 mr-3">
//                               <img
//                                 src={getImageUrl(product.images?.[0])}
//                                 alt={product.name}
//                                 className="h-10 w-10 rounded object-cover"
//                               />
//                             </div>
//                             <div className="text-sm font-medium text-dark-900">
//                               {product.name}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.subcategory}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {product.category}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {product.stock}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                           <div className="flex flex-col">
//                             <div className="font-semibold">₹{product.price.toFixed(2)}</div>
//                             {product.salePrice > 0 && (
//                               <div className="text-sm text-red-600 line-through">₹{product.salePrice.toFixed(2)}</div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => openProductViewModal(product)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Details"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openProductEditModal(product)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="Edit"
//                             >
//                               <FiEdit2 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(product.id, product.isActive)}
//                               className={`p-1 rounded hover:bg-opacity-20 ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-500" : "text-green-600 hover:text-green-900 hover:bg-green-500"}`}
//                               title={product.isActive ? "Deactivate" : "Activate"}
//                             >
//                               {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteProduct(product.id)}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         {loading ? 'Loading products...' : 'No products found'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* --- PAGINATION & ROWS PER PAGE --- */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//             <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-dark-700">Rows per page:</span>
//                 <select
//                   className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setPage(1);
//                   }}
//                 >
//                   {rowsPerPageOptions.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p className="text-sm text-dark-700">
//                   Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(
//                       page * rowsPerPage,
//                       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                       (filteredProducts?.length || 0)
//                     )}
//                   </span>{' '}
//                   of{' '}
//                   <span className="font-medium">
//                     {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                      activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                      (filteredProducts?.length || 0)}
//                   </span>{' '}
//                   results
//                 </p>
//               </div>
//             </div>

//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setPage(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       page === i + 1
//                         ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                         : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">

//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === 'PRODUCT_VIEW' && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">Product Details</h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.name}</div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>
//                             <div className="input-field bg-gray-50 min-h-[100px]">{viewingProduct.description}</div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50">{viewingProduct.category}</div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50">{viewingProduct.subcategory}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Pricing & Stock</h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">₹{viewingProduct.price.toFixed(2)}</div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50">
//                                 {viewingProduct.salePrice > 0 ? `₹${viewingProduct.salePrice.toFixed(2)}` : 'Not on sale'}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.stock}</div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div className={`px-3 py-2 rounded-lg ${viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Attributes */}
//                         {viewingProduct.attributes && viewingProduct.attributes.length > 0 && (
//                           <div className="mt-6">
//                             <h3 className="text-lg font-semibold mb-2">Attributes</h3>
//                             <div className="space-y-2">
//                               {viewingProduct.attributes.map((attr: any, index: number) => (
//                                 <div key={index} className="flex justify-between">
//                                   <span className="text-dark-700">{attr.type}:</span>
//                                   <span className="font-medium">{attr.value}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Images */}
//                     {viewingProduct.images && viewingProduct.images.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Images</h3>
//                         <div className="grid grid-cols-4 gap-2">
//                           {viewingProduct.images.map((img, index) => (
//                             <div key={index} className="relative aspect-square">
//                               <img
//                                 src={getImageUrl(img)}
//                                 alt={`Product ${index + 1}`}
//                                 className="w-full h-full object-cover rounded-lg border border-primary-500/50"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex gap-3 pt-6">
//                       <button
//                         onClick={() => {
//                           closeModal();
//                           openProductEditModal(viewingProduct);
//                         }}
//                         className="btn-primary flex-1"
//                       >
//                         Edit Product
//                       </button>
//                       <button onClick={closeModal} className="btn-ghost flex-1">Close</button>
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-dark-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field bg-white" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field bg-white" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter sizes separated by commas (e.g., S, M, L, XL)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-dark-400 mt-1">
//                             Enter colours separated by commas (e.g., Red, Black, Blue)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     {/* IMAGES SECTION */}
//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-dark-400" />
//                                     <p className="text-sm text-dark-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-primary-500/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VIDEOS SECTION */}
//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800 hover:bg-dark-700">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-dark-400" />
//                             <p className="text-sm text-dark-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-dark-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-dark-900">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-dark-400 hover:text-dark-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field bg-white" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-dark-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT_VIEW';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   const [sizesInput, setSizesInput] = useState('');
//   const [colorsInput, setColorsInput] = useState('');
//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal('PRODUCT_VIEW');
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value)
//         .join(', ') || '';

//       setSizesInput(sizes);
//       setColorsInput(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizesInput('');
//       setColorsInput('');
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       const updatedAttributes: any[] = [];

//       if (sizesInput.trim()) {
//         const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(s => s !== '');
//         sizesArray.forEach(size => {
//           updatedAttributes.push({ type: 'Size', value: size });
//         });
//       }

//       if (colorsInput.trim()) {
//         const colorsArray = colorsInput.split(',').map(c => c.trim()).filter(c => c !== '');
//         colorsArray.forEach(color => {
//           updatedAttributes.push({ type: 'Color', value: color });
//         });
//       }

//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price,
//         salePrice: productForm.salePrice,
//         stock: productForm.stock,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images,
//         videos: productForm.videos || [],
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'PRODUCT' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'CATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="mb-6">
//           <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === 'CATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories && paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteCategory(category.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === 'SUBCATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Category</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteSubCategory(sub.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === 'PRODUCT' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Category"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.category}
//                                 onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product, index) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">{product.name}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.subcategory}</div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.category}</div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">₹{product.price.toFixed(2)}</div>
//                                   {product.salePrice > 0 && (
//                                     <div className="text-xs text-red-600 line-through">₹{product.salePrice.toFixed(2)}</div>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() => openProductViewModal(product)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => openProductEditModal(product)}
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleToggleStatus(product.id, product.isActive)}
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={product.isActive ? "Deactivate" : "Activate"}
//                                   >
//                                     {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteProduct(product.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                               {loading ? 'Loading products...' : 'No products found'}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                         activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                         (filteredProducts?.length || 0)
//                       )}
//                     </span>{' '}
//                     of{' '}
//                     <span className="font-medium">
//                       {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                        activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                        (filteredProducts?.length || 0)}
//                     </span>{' '}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? 'z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200">

//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === 'PRODUCT_VIEW' && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">{viewingProduct.name}</div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>
//                             <div className="input-field bg-gray-50 min-h-[100px] break-words whitespace-pre-wrap">{viewingProduct.description}</div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.category}</div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.subcategory}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Pricing & Stock</h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">₹{viewingProduct.price.toFixed(2)}</div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice > 0 ? `₹${viewingProduct.salePrice.toFixed(2)}` : 'Not on sale'}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.stock}</div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
//                             </div>
//                           </div>
//                         </div>

//                         {viewingProduct.attributes && viewingProduct.attributes.length > 0 && (
//                           <div className="mt-6">
//                             <h3 className="text-lg font-semibold mb-2">Attributes</h3>
//                             <div className="space-y-2">
//                               {viewingProduct.attributes.map((attr: any, index: number) => (
//                                 <div key={index} className="flex justify-between">
//                                   <span className="text-gray-700 break-words">{attr.type}:</span>
//                                   <span className="font-medium break-words">{attr.value}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {viewingProduct.images && viewingProduct.images.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Images</h3>
//                         <div className="grid grid-cols-4 gap-2">
//                           {viewingProduct.images.map((img, index) => (
//                             <div key={index} className="relative aspect-square">
//                               <img
//                                 src={getImageUrl(img)}
//                                 alt={`Product ${index + 1}`}
//                                 className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex gap-3 pt-6">
//                       <button
//                         onClick={() => {
//                           closeModal();
//                           openProductEditModal(viewingProduct);
//                         }}
//                         className="btn-primary flex-1"
//                       >
//                         Edit Product
//                       </button>
//                       <button onClick={closeModal} className="btn-ghost flex-1">Close</button>
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Sizes</label>
//                           <input
//                             type="text"
//                             value={sizesInput}
//                             onChange={(e) => setSizesInput(e.target.value)}
//                             placeholder="S, M, L, XL (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-gray-400 mt-1">
//                             Enter sizes separated by commas (e.g., S, M, L, XL)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Colours</label>
//                           <input
//                             type="text"
//                             value={colorsInput}
//                             onChange={(e) => setColorsInput(e.target.value)}
//                             placeholder="Red, Black, Blue (comma separated)"
//                             className="input-field"
//                           />
//                           <p className="text-xs text-gray-400 mt-1">
//                             Enter colours separated by commas (e.g., Red, Black, Blue)
//                           </p>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>
//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                                     <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiPlay className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={index} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-gray-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// import type { Product, CreateProductRequest, ProductAttribute } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT_VIEW';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// // Tag component for sizes and colors
// interface TagProps {
//   text: string;
//   onRemove: () => void;
// }

// const Tag = ({ text, onRemove }: TagProps) => {
//   return (
//     <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//       {text}
//       <button
//         type="button"
//         onClick={onRemove}
//         className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
//       >
//         <FiX size={14} />
//       </button>
//     </div>
//   );
// };

// // Tag input component
// interface TagInputProps {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder?: string;
//   label?: string;
// }

// const TagInput = ({ tags, onTagsChange, placeholder = "Type and press Enter", label }: TagInputProps) => {
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter(tag => tag !== tagToRemove));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     if (inputValue.trim()) {
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-semibold text-gray-700">{label}</label>
//       )}
//       <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
//           ))}
//         </div>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onBlur={handleInputBlur}
//           placeholder={tags.length === 0 ? placeholder : ''}
//           className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
//         />
//       </div>
//       <p className="text-xs text-gray-400">
//         Type and press Enter to add tags
//       </p>
//     </div>
//   );
// };

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   // New tag states
//   const [sizeTags, setSizeTags] = useState<string[]>([]);
//   const [colorTags, setColorTags] = useState<string[]>([]);

//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   const getImageUrl = (path?: string) => {
//     const url = getMediaUrl(path);
//     return url || '/placeholder.jpg';
//   };

//   const getVideoUrl = (path?: string) => {
//     return getMediaUrl(path);
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal('PRODUCT_VIEW');
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       // Extract sizes and colors from attributes to tags
//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value) || [];

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value) || [];

//       setSizeTags(sizes);
//       setColorTags(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizeTags([]);
//       setColorTags([]);
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       const updatedAttributes: any[] = [];

//       // Add sizes as attributes
//       sizeTags.forEach(size => {
//         updatedAttributes.push({ type: 'Size', value: size });
//       });

//       // Add colors as attributes
//       colorTags.forEach(color => {
//         updatedAttributes.push({ type: 'Color', value: color });
//       });

//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price,
//         salePrice: productForm.salePrice,
//         stock: productForm.stock,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images,
//         videos: productForm.videos || [],
//         attributes: updatedAttributes
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated');
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created!');
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       toast.error('Failed to save product.');
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save category');
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save subcategory');
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error) {
//       console.error('Delete product error:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error) {
//       console.error('Delete category error:', error);
//       toast.error('Failed to delete category');
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error) {
//       console.error('Delete subcategory error:', error);
//       toast.error('Failed to delete subcategory');
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error) {
//       console.error('Toggle status error:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'PRODUCT' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'CATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="mb-6">
//           <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === 'CATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories && paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteCategory(category.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === 'SUBCATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Category</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteSubCategory(sub.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === 'PRODUCT' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Category"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.category}
//                                 onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product, index) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">{product.name}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.subcategory}</div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.category}</div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">₹{product.price.toFixed(2)}</div>
//                                   {product.salePrice > 0 && (
//                                     <div className="text-xs text-red-600 line-through">₹{product.salePrice.toFixed(2)}</div>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() => openProductViewModal(product)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => openProductEditModal(product)}
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleToggleStatus(product.id, product.isActive)}
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={product.isActive ? "Deactivate" : "Activate"}
//                                   >
//                                     {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteProduct(product.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                               {loading ? 'Loading products...' : 'No products found'}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                         activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                         (filteredProducts?.length || 0)
//                       )}
//                     </span>{' '}
//                     of{' '}
//                     <span className="font-medium">
//                       {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                        activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                        (filteredProducts?.length || 0)}
//                     </span>{' '}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? 'z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200">

//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === 'PRODUCT_VIEW' && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">{viewingProduct.name}</div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>
//                             <div className="input-field bg-gray-50 min-h-[100px] break-words whitespace-pre-wrap">{viewingProduct.description}</div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.category}</div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.subcategory}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Pricing & Stock</h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">₹{viewingProduct.price.toFixed(2)}</div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice > 0 ? `₹${viewingProduct.salePrice.toFixed(2)}` : 'Not on sale'}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.stock}</div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags display in view mode */}
//                         {viewingProduct.attributes && viewingProduct.attributes.length > 0 && (
//                           <div className="mt-6">
//                             <h3 className="text-lg font-semibold mb-2">Attributes</h3>
//                             <div className="space-y-4">
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Sizes</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No sizes specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Colors</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No colors specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Images and Videos in view mode */}
//                     <div className="space-y-6">
//                       {viewingProduct.images && viewingProduct.images.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Images</h3>
//                           <div className="grid grid-cols-4 gap-2">
//                             {viewingProduct.images.map((img, index) => (
//                               <div key={index} className="relative aspect-square">
//                                 <img
//                                   src={getImageUrl(img)}
//                                   alt={`Product ${index + 1}`}
//                                   className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {viewingProduct.videos && viewingProduct.videos.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Videos</h3>
//                           <div className="grid grid-cols-2 gap-2">
//                             {viewingProduct.videos.map((video, index) => {
//                               const videoUrl = getVideoUrl(video);
//                               return videoUrl ? (
//                                 <div key={index} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
//                                   <video
//                                     src={videoUrl}
//                                     className="w-full h-full object-cover"
//                                     controls
//                                     preload="metadata"
//                                   />
//                                 </div>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-3 pt-6">
//                       <button
//                         onClick={() => {
//                           closeModal();
//                           openProductEditModal(viewingProduct);
//                         }}
//                         className="btn-primary flex-1"
//                       >
//                         Edit Product
//                       </button>
//                       <button onClick={closeModal} className="btn-ghost flex-1">Close</button>
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>

//                     {/* Tag inputs for sizes and colors */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TagInput
//                         tags={sizeTags}
//                         onTagsChange={setSizeTags}
//                         label="Sizes"
//                         placeholder="Type size and press Enter (e.g., S, M, L)"
//                       />
//                       <TagInput
//                         tags={colorTags}
//                         onTagsChange={setColorTags}
//                         label="Colors"
//                         placeholder="Type color and press Enter (e.g., Red, Black)"
//                       />
//                     </div>

//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                                     <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {/* Existing videos */}
//                         {productForm.videos.map((video, index) => {
//                           const videoUrl = getVideoUrl(video);
//                           return videoUrl ? (
//                             <div key={`exist-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                               <video src={videoUrl} className="w-full h-full object-cover" muted />
//                               <button type="button" onClick={() => setProductForm(prev => ({...prev, videos: prev.videos.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                                 <FiX size={12} />
//                               </button>
//                             </div>
//                           ) : null;
//                         })}

//                         {/* New video previews */}
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={`new-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-gray-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// // 2. FIXED: Removed unused 'ProductAttribute' to clear warning
// import type { Product, CreateProductRequest } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT_VIEW';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// // Tag component for sizes and colors
// interface TagProps {
//   text: string;
//   onRemove: () => void;
// }

// const Tag = ({ text, onRemove }: TagProps) => {
//   return (
//     <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//       {text}
//       <button
//         type="button"
//         onClick={onRemove}
//         className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
//       >
//         <FiX size={14} />
//       </button>
//     </div>
//   );
// };

// // Tag input component
// interface TagInputProps {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder?: string;
//   label?: string;
// }

// const TagInput = ({ tags, onTagsChange, placeholder = "Type and press Enter", label }: TagInputProps) => {
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter(tag => tag !== tagToRemove));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     if (inputValue.trim()) {
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-semibold text-gray-700">{label}</label>
//       )}
//       <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
//           ))}
//         </div>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onBlur={handleInputBlur}
//           placeholder={tags.length === 0 ? placeholder : ''}
//           className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
//         />
//       </div>
//       <p className="text-xs text-gray-400">
//         Type and press Enter to add tags
//       </p>
//     </div>
//   );
// };

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: 0, salePrice: 0, stock: 0,
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   // New tag states
//   const [sizeTags, setSizeTags] = useState<string[]>([]);
//   const [colorTags, setColorTags] = useState<string[]>([]);

//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   const getImageUrl = (path?: string) => {
//     const url = getMediaUrl(path);
//     return url || '/placeholder.jpg';
//   };

//   const getVideoUrl = (path?: string) => {
//     return getMediaUrl(path);
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to load data';
//       toast.error(errorMessage);
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal('PRODUCT_VIEW');
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || 0,
//         salePrice: product.salePrice || 0,
//         stock: product.stock || 0,
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       // Extract sizes and colors from attributes to tags
//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value) || [];

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value) || [];

//       setSizeTags(sizes);
//       setColorTags(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: 0, salePrice: 0, stock: 0,
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizeTags([]);
//       setColorTags([]);
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
// const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const t = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...');

//     try {
//       const formData = new FormData();
//       const updatedAttributes: any[] = [];

//       // 3. FIXED: Using 'sizeTags' and 'colorTags' arrays instead of missing string inputs
//       sizeTags.forEach(size => updatedAttributes.push({ type: 'Size', value: size }));
//       colorTags.forEach(color => updatedAttributes.push({ type: 'Color', value: color }));

//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price,
//         salePrice: productForm.salePrice,
//         stock: productForm.stock,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images,
//         videos: productForm.videos || [], // FIXED: Added fallback for undefined
//         attributes: updatedAttributes,
//         isActive: editingProduct ? editingProduct.isActive : true
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         // 4. FIXED: Pass 'formData' instead of 'productData' for the Update API
//         await productApi.updateProduct(editingProduct.id, formData);
//         toast.success('Product updated successfully', { id: t });
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created successfully', { id: t });
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save product.';

//       // If there are validation errors, display them
//       if (error.response?.data?.errors) {
//         const validationErrors = Object.values(error.response.data.errors).flat();
//         validationErrors.forEach((err: any) => toast.error(err));
//       } else {
//         toast.error(errorMessage);
//       }
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     try {
//       if (editingCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id
//             ? { ...c, name: categoryForm.name, description: categoryForm.description }
//             : c
//         ) : []);
//         toast.success(`Category '${categoryForm.name}' updated (locally)`);
//       } else {
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save category';
//       toast.error(errorMessage);
//     }
//   };

//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? { ...sc, name: subCatForm.name, description: subCatForm.description }
//                     : sc
//                 )
//               }
//             : c
//         ) : []);
//         toast.success(`Subcategory '${subCatForm.name}' updated (locally)`);
//       } else {
//         const newSub = await categoryApi.createSubCategory(parentId, subCatForm.name, subCatForm.description);
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];
//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' added`);
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save subcategory';
//       toast.error(errorMessage);
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted');
//       fetchData();
//     } catch (error: any) {
//       console.error('Delete product error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to delete product';
//       toast.error(errorMessage);
//     }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!confirm('Delete this category? This will also delete all subcategories.')) return;
//     try {
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success('Category deleted (locally)');
//     } catch (error: any) {
//       console.error('Delete category error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to delete category';
//       toast.error(errorMessage);
//     }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     if (!confirm('Delete this subcategory?')) return;
//     try {
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);
//       toast.success('Subcategory deleted (locally)');
//     } catch (error: any) {
//       console.error('Delete subcategory error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to delete subcategory';
//       toast.error(errorMessage);
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸');
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶');
//       }
//       fetchData();
//     } catch (error: any) {
//       console.error('Toggle status error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to update status';
//       toast.error(errorMessage);
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setProductForm(prev => ({ ...prev, category: value, subcategory: '' }));
//     } else {
//       setProductForm(prev => ({
//         ...prev,
//         [name]: ['price', 'salePrice', 'stock'].includes(name) ? Number(value) : value,
//       }));
//     }
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'PRODUCT' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'CATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="mb-6">
//           <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === 'CATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories && paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteCategory(category.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === 'SUBCATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Category</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteSubCategory(sub.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === 'PRODUCT' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Category"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.category}
//                                 onChange={(e) => handleColumnFilterChange('category', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product, index) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">{product.name}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.subcategory}</div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.category}</div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">₹{product.price.toFixed(2)}</div>
//                                   {product.salePrice > 0 && (
//                                     <div className="text-xs text-red-600 line-through">₹{product.salePrice.toFixed(2)}</div>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() => openProductViewModal(product)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => openProductEditModal(product)}
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleToggleStatus(product.id, product.isActive)}
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={product.isActive ? "Deactivate" : "Activate"}
//                                   >
//                                     {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteProduct(product.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                               {loading ? 'Loading products...' : 'No products found'}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                         activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                         (filteredProducts?.length || 0)
//                       )}
//                     </span>{' '}
//                     of{' '}
//                     <span className="font-medium">
//                       {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                        activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                        (filteredProducts?.length || 0)}
//                     </span>{' '}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? 'z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200">

//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === 'PRODUCT_VIEW' && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">{viewingProduct.name}</div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>
//                             <div className="input-field bg-gray-50 min-h-[100px] break-words whitespace-pre-wrap">{viewingProduct.description}</div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.category}</div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.subcategory}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Pricing & Stock</h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">₹{viewingProduct.price.toFixed(2)}</div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice > 0 ? `₹${viewingProduct.salePrice.toFixed(2)}` : 'Not on sale'}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.stock}</div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags display in view mode */}
//                         {viewingProduct.attributes && viewingProduct.attributes.length > 0 && (
//                           <div className="mt-6">
//                             <h3 className="text-lg font-semibold mb-2">Attributes</h3>
//                             <div className="space-y-4">
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Sizes</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No sizes specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Colors</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No colors specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Images and Videos in view mode */}
//                     <div className="space-y-6">
//                       {viewingProduct.images && viewingProduct.images.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Images</h3>
//                           <div className="grid grid-cols-4 gap-2">
//                             {viewingProduct.images.map((img, index) => (
//                               <div key={index} className="relative aspect-square">
//                                 <img
//                                   src={getImageUrl(img)}
//                                   alt={`Product ${index + 1}`}
//                                   className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {viewingProduct.videos && viewingProduct.videos.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Videos</h3>
//                           <div className="grid grid-cols-2 gap-2">
//                             {viewingProduct.videos.map((video, index) => {
//                               const videoUrl = getVideoUrl(video);
//                               return videoUrl ? (
//                                 <div key={index} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
//                                   <video
//                                     src={videoUrl}
//                                     className="w-full h-full object-cover"
//                                     controls
//                                     preload="metadata"
//                                   />
//                                 </div>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-3 pt-6">
//                       <button
//                         onClick={() => {
//                           closeModal();
//                           openProductEditModal(viewingProduct);
//                         }}
//                         className="btn-primary flex-1"
//                       >
//                         Edit Product
//                       </button>
//                       <button onClick={closeModal} className="btn-ghost flex-1">Close</button>
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                           <label className="label">Price *</label>
//                           <input type="number" name="price" value={productForm.price} onChange={handleProductInputChange} className="input-field" required min="0" step="0.01"/>
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                           <input type="number" name="salePrice" value={productForm.salePrice} onChange={handleProductInputChange} className="input-field" min="0" step="0.01"/>
//                         </div>
//                     </div>

//                     {/* Tag inputs for sizes and colors */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TagInput
//                         tags={sizeTags}
//                         onTagsChange={setSizeTags}
//                         label="Sizes"
//                         placeholder="Type size and press Enter (e.g., S, M, L)"
//                       />
//                       <TagInput
//                         tags={colorTags}
//                         onTagsChange={setColorTags}
//                         label="Colors"
//                         placeholder="Type color and press Enter (e.g., Red, Black)"
//                       />
//                     </div>

//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     <div>
//                         <label className="label">Images</label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                                     <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {/* Existing videos */}
//                         {productForm.videos.map((video, index) => {
//                           const videoUrl = getVideoUrl(video);
//                           return videoUrl ? (
//                             <div key={`exist-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                               <video src={videoUrl} className="w-full h-full object-cover" muted />
//                               <button type="button" onClick={() => setProductForm(prev => ({...prev, videos: prev.videos.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                                 <FiX size={12} />
//                               </button>
//                             </div>
//                           ) : null;
//                         })}

//                         {/* New video previews */}
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={`new-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-gray-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiFolder, FiGrid, FiPause, FiPlay, FiEye, FiSearch } from 'react-icons/fi';
// import { productApi } from '../../api/productApi';
// import { categoryApi, type Category } from '../../api/categoryApi';
// // 2. FIXED: Removed unused 'ProductAttribute' to clear warning
// import type { Product, CreateProductRequest } from '../../types';
// import toast from 'react-hot-toast';

// // --- CONFIGURATION ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// // Define the modes for our modal system
// type ModalType = 'NONE' | 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT_VIEW';
// type AdminTab = 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT';

// // Tag component for sizes and colors
// interface TagProps {
//   text: string;
//   onRemove: () => void;
// }

// const Tag = ({ text, onRemove }: TagProps) => {
//   return (
//     <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//       {text}
//       <button
//         type="button"
//         onClick={onRemove}
//         className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
//       >
//         <FiX size={14} />
//       </button>
//     </div>
//   );
// };

// // Tag input component
// interface TagInputProps {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder?: string;
//   label?: string;
// }

// const TagInput = ({ tags, onTagsChange, placeholder = "Type and press Enter", label }: TagInputProps) => {
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter(tag => tag !== tagToRemove));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     if (inputValue.trim()) {
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue('');
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-semibold text-gray-700">{label}</label>
//       )}
//       <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
//           ))}
//         </div>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onBlur={handleInputBlur}
//           placeholder={tags.length === 0 ? placeholder : ''}
//           className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
//         />
//       </div>
//       <p className="text-xs text-gray-400">
//         Type and press Enter to add tags
//       </p>
//     </div>
//   );
// };

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>('NONE');
//   const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCT');
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<CreateProductRequest>({
//     name: '', description: '', price: '', salePrice: '', stock: '',
//     category: '', subcategory: '', images: [], videos: [], attributes: [],
//   });

//   // New tag states
//   const [sizeTags, setSizeTags] = useState<string[]>([]);
//   const [colorTags, setColorTags] = useState<string[]>([]);

//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [subCatForm, setSubCatForm] = useState({ parentCategoryId: '', name: '', description: '' });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: '',
//     subcategory: '',
//     category: '',
//     status: ''
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   const getImageUrl = (path?: string) => {
//     const url = getMediaUrl(path);
//     return url || '/placeholder.jpg';
//   };

//   const getVideoUrl = (path?: string) => {
//     return getMediaUrl(path);
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories()
//       ]);
//       setProducts(Array.isArray(prodRes.content) ? prodRes.content :
//                   Array.isArray(prodRes) ? prodRes : []);
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to load data';
//       toast.error(errorMessage);
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories)) return [];
//     const category = categories.find(c => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(cat =>
//         cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         cat.description?.toLowerCase().includes(columnFilters.item.toLowerCase())
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories.flatMap(cat =>
//       (cat.subCategories || []).map(sub => ({
//         ...sub,
//         parentName: cat.name,
//         parentId: cat.id
//       }))
//     ).sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(sub =>
//       sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//       (sub.parentName || '').toLowerCase().includes(columnFilters.item.toLowerCase())
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter(prod => {
//         const matchesItem = (prod.name || '').toLowerCase().includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || '').toLowerCase().includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || '').toLowerCase().includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === '' ||
//           (columnFilters.status === 'ACTIVE' && prod.isActive) ||
//           (columnFilters.status === 'INACTIVE' && !prod.isActive);

//         return matchesItem && matchesSubcategory && matchesCategory && matchesStatus;
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories)) return [];
//     return filteredSubCategories.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//       activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//       (filteredProducts?.length || 0);

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [activeTab, filteredCategories, filteredSubCategories, filteredProducts, rowsPerPage]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal('PRODUCT_VIEW');
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price != null ? String(product.price) : '',
//   salePrice: product.salePrice ? String(product.salePrice) : '',
//   stock: product.stock != null ? String(product.stock) : '',
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       // Extract sizes and colors from attributes to tags
//       const sizes = product.attributes
//         ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//         .map((attr: any) => attr.value) || [];

//       const colors = product.attributes
//         ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//         .map((attr: any) => attr.value) || [];

//       setSizeTags(sizes);
//       setColorTags(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: '', description: '', price: '', salePrice: '', stock: '',
//         category: '', subcategory: '', images: [], videos: [], attributes: [],
//       });
//       setSizeTags([]);
//       setColorTags([]);
//     }
//     setActiveModal('PRODUCT');
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ name: category.name || '', description: category.description || '' });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: '', description: '' });
//     }
//     setActiveModal('CATEGORY');
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || '',
//         name: subCategory.name || '',
//         description: subCategory.description || ''
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: '', name: '', description: '' });
//     }
//     setActiveModal('SUBCATEGORY');
//   };

//   const closeModal = () => {
//     setActiveModal('NONE');
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map(file => URL.createObjectURL(file));
//       setPreviewUrls(prev => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos(prev => [...prev, ...files]);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setVideoPreviewUrls(prev => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//   if (productForm.salePrice === '0') {
//     toast.error('Sale price cannot be 0');
//     return;
//   }
//     const t = toast.loading(
//     editingProduct ? 'Updating product...' : 'Creating product...'
//   );
//     try {
//       const formData = new FormData();
//       const updatedAttributes: any[] = [];

//       // 3. FIXED: Using 'sizeTags' and 'colorTags' arrays instead of missing string inputs
//       sizeTags.forEach(size => updatedAttributes.push({ type: 'Size', value: size }));
//       colorTags.forEach(color => updatedAttributes.push({ type: 'Color', value: color }));

//       const productData = {
//   name: productForm.name,
//   description: productForm.description,
//   price: productForm.price ? Number(productForm.price) : null,
//   salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
//   stock: productForm.stock ? Number(productForm.stock) : 0,
//   category: productForm.category,
//   subcategory: productForm.subcategory,
//   images: productForm.images,
//   videos: productForm.videos || [],
//   attributes: updatedAttributes,
//   isActive: editingProduct ? editingProduct.isActive : true,
// };

//       const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
//       formData.append('product', productBlob);

//       selectedFiles.forEach((file) => formData.append('imageFiles', file));
//       selectedVideos.forEach((video) => formData.append('videoFiles', video));

//       if (editingProduct) {
//         // 4. FIXED: Pass 'formData' instead of 'productData' for the Update API
//         await productApi.updateProduct(editingProduct.id, formData);
//         toast.success('Product updated successfully', { id: t });
//       } else {
//         await productApi.createProduct(formData);
//         toast.success('Product created successfully', { id: t });
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save product.';

//       // If there are validation errors, display them
//       if (error.response?.data?.errors) {
//         const validationErrors = Object.values(error.response.data.errors).flat();
//         validationErrors.forEach((err: any) => toast.error(err));
//       } else {
//         toast.error(errorMessage);
//       }
//     }
//   };

//   // UPDATED: Category form handler with API calls
//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     const t = toast.loading(editingCategory ? 'Updating category...' : 'Creating category...');

//     try {
//       if (editingCategory) {
//         // Update existing category using API
//         const updatedCat = await categoryApi.updateCategory(
//           editingCategory.id,
//           categoryForm.name,
//           categoryForm.description
//         );

//         // Update local state
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === editingCategory.id ? updatedCat : c
//         ) : []);

//         toast.success(`Category '${updatedCat.name}' updated`, { id: t });
//       } else {
//         // Create new category using API
//         const newCat = await categoryApi.createCategory(categoryForm.name, categoryForm.description);
//         setCategories(prev => prev ? [...prev, newCat] : [newCat]);
//         toast.success(`Category '${newCat.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Category API Error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save category';

//       // Handle duplicate category error
//       if (error.response?.status === 409) {
//         toast.error(`Category '${categoryForm.name}' already exists`, { id: t });
//       } else {
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory form handler with API calls
//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name) return toast.error("All fields required");

//     const t = toast.loading(editingSubCategory ? 'Updating subcategory...' : 'Creating subcategory...');

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         // Update existing subcategory using API
//         const updatedSub = await categoryApi.updateSubCategory(
//           editingSubCategory.id,
//           subCatForm.name,
//           subCatForm.description
//         );

//         // Update local state
//         setCategories(prev => prev ? prev.map(c =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 subCategories: (c.subCategories || []).map(sc =>
//                   sc.id === editingSubCategory.id
//                     ? updatedSub
//                     : sc
//                 )
//               }
//             : c
//         ) : []);

//         toast.success(`Subcategory '${updatedSub.name}' updated`, { id: t });
//       } else {
//         // Create new subcategory using API
//         const newSub = await categoryApi.createSubCategory(
//           parentId,
//           subCatForm.name,
//           subCatForm.description
//         );

//         // Update local state
//         const updatedCats = categories ? categories.map(c =>
//           c.id === parentId
//             ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//             : c
//         ) : [];

//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error('Subcategory API Error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to save subcategory';
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm('Delete this product?')) return;
//     const t = toast.loading('Deleting product...');

//     try {
//       await productApi.deleteProduct(id);
//       toast.success('Product deleted', { id: t });
//       fetchData();
//     } catch (error: any) {
//       console.error('Delete product error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to delete product';
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // UPDATED: Category delete handler with API call
//   const handleDeleteCategory = async (id: number, categoryName: string) => {
//     if (!confirm(`Delete category '${categoryName}'? This will also delete all subcategories.`)) return;

//     const t = toast.loading('Deleting category...');

//     try {
//       await categoryApi.deleteCategory(id);
//       setCategories(prev => prev ? prev.filter(c => c.id !== id) : []);
//       toast.success(`Category '${categoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error('Delete category error:', error);

//       // Handle case when category has subcategories
//       if (error.response?.status === 400) {
//         const errorMessage = error.response?.data?.message ||
//                             'Cannot delete category because it has subcategories';
//         toast.error(errorMessage, { id: t });
//       } else {
//         const errorMessage = error.response?.data?.message ||
//                             error.response?.data?.error ||
//                             error.message ||
//                             'Failed to delete category';
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory delete handler with API call
//   const handleDeleteSubCategory = async (id: number, subCategoryName: string) => {
//     if (!confirm(`Delete subcategory '${subCategoryName}'?`)) return;

//     const t = toast.loading('Deleting subcategory...');

//     try {
//       await categoryApi.deleteSubCategory(id);

//       // Update local state
//       setCategories(prev => prev ? prev.map(c => ({
//         ...c,
//         subCategories: (c.subCategories || []).filter(sc => sc.id !== id)
//       })) : []);

//       toast.success(`Subcategory '${subCategoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error('Delete subcategory error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to delete subcategory';
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     const t = toast.loading(currentStatus ? 'Deactivating product...' : 'Activating product...');

//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success('Product Deactivated ⏸', { id: t });
//       } else {
//         await productApi.activateProduct(id);
//         toast.success('Product Activated ▶', { id: t });
//       }
//       fetchData();
//     } catch (error: any) {
//       console.error('Toggle status error:', error);
//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.error ||
//                           error.message ||
//                           'Failed to update status';
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// ) => {
//   const { name, value } = e.target;

//   if (name === 'category') {
//     setProductForm(prev => ({
//       ...prev,
//       category: value,
//       subcategory: '',
//     }));
//     return;
//   }

//   setProductForm(prev => ({
//     ...prev,
//     [name]: value === '' ? '' : value,
//   }));
// };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === 'PRODUCT' && `${filteredProducts?.length || 0} products total`}
//             {activeTab === 'CATEGORY' && `${filteredCategories?.length || 0} categories total`}
//             {activeTab === 'SUBCATEGORY' && `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'PRODUCT' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('PRODUCT')}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'CATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('CATEGORY')}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === 'SUBCATEGORY' ? 'border-b-2 border-[#8FAE8B] text-[#8FAE8B]' : 'text-dark-600 hover:text-dark-900'}`}
//           onClick={() => setActiveTab('SUBCATEGORY')}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === 'CATEGORY' || activeTab === 'SUBCATEGORY') && (
//         <div className="mb-6">
//           <div className="
//   flex items-center space-x-2 p-3
//   bg-white
//   border-2 border-slate-400
//   rounded-lg
//   shadow-sm
//   focus-within:border-[#8FAE8B]
//   focus-within:ring-2 focus-within:ring-[#8FAE8B]/30
// ">

//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === 'CATEGORY' ? 'categories' : 'subcategories'}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange('item', '')}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === 'CATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories && paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteCategory(category.id, category.name)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === 'SUBCATEGORY' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Sr. No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Category</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories && paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || '-'}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === 'PRODUCT' && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) => handleColumnFilterChange('item', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) => handleColumnFilterChange('subcategory', e.target.value)}
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//   type="text"
//   placeholder="Search Category"
//   className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//   value={columnFilters.category}
//   onChange={(e) => handleColumnFilterChange('category', e.target.value)}
// />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product, index) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">{product.name}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.subcategory}</div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">{product.category}</div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">
//   ₹{product.price != null ? product.price.toFixed(2) : '0.00'}
// </div>
//                                   {product.salePrice != null && product.salePrice > 0 && (
//   <div className="text-xs text-red-600 line-through">
//     ₹{product.salePrice.toFixed(2)}
//   </div>
// )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                   {product.isActive ? 'ACTIVE' : 'INACTIVE'}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() => openProductViewModal(product)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => openProductEditModal(product)}
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleToggleStatus(product.id, product.isActive)}
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={product.isActive ? "Deactivate" : "Activate"}
//                                   >
//                                     {product.isActive ? <FiPause size={16} /> : <FiPlay size={16} />}
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteProduct(product.id)}
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                               {loading ? 'Loading products...' : 'No products found'}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                         activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                         (filteredProducts?.length || 0)
//                       )}
//                     </span>{' '}
//                     of{' '}
//                     <span className="font-medium">
//                       {activeTab === 'CATEGORY' ? (filteredCategories?.length || 0) :
//                        activeTab === 'SUBCATEGORY' ? (filteredSubCategories?.length || 0) :
//                        (filteredProducts?.length || 0)}
//                     </span>{' '}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? 'z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== 'NONE' && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="backdrop-overlay" />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200">

//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === 'PRODUCT_VIEW' && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">{viewingProduct.name}</div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>
//                             <div className="input-field bg-gray-50 min-h-[100px] break-words whitespace-pre-wrap">{viewingProduct.description}</div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.category}</div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">{viewingProduct.subcategory}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">Pricing & Stock</h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">
//   ₹{viewingProduct.price != null ? viewingProduct.price.toFixed(2) : '0.00'}
// </div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice != null && viewingProduct.salePrice > 0
//   ? `₹${viewingProduct.salePrice.toFixed(2)}`
//   : 'Not on sale'}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">{viewingProduct.stock}</div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags display in view mode */}
//                         {viewingProduct.attributes && viewingProduct.attributes.length > 0 && (
//                           <div className="mt-6">
//                             <h3 className="text-lg font-semibold mb-2">Attributes</h3>
//                             <div className="space-y-4">
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Sizes</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Size' || attr.type === 'size').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No sizes specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-700 mb-2 block">Colors</label>
//                                 <div className="flex flex-wrap gap-2">
//                                   {viewingProduct.attributes
//                                     ?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour')
//                                     .map((attr: any, index: number) => (
//                                       <div key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//                                         {attr.value}
//                                       </div>
//                                     ))}
//                                   {viewingProduct.attributes?.filter((attr: any) => attr.type === 'Color' || attr.type === 'color' || attr.type === 'Colour').length === 0 && (
//                                     <span className="text-gray-400 text-sm">No colors specified</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Images and Videos in view mode */}
//                     <div className="space-y-6">
//                       {viewingProduct.images && viewingProduct.images.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Images</h3>
//                           <div className="grid grid-cols-4 gap-2">
//                             {viewingProduct.images.map((img, index) => (
//                               <div key={index} className="relative aspect-square">
//                                 <img
//                                   src={getImageUrl(img)}
//                                   alt={`Product ${index + 1}`}
//                                   className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {viewingProduct.videos && viewingProduct.videos.length > 0 && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-2">Product Videos</h3>
//                           <div className="grid grid-cols-2 gap-2">
//                             {viewingProduct.videos.map((video, index) => {
//                               const videoUrl = getVideoUrl(video);
//                               return videoUrl ? (
//                                 <div key={index} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
//                                   <video
//                                     src={videoUrl}
//                                     className="w-full h-full object-cover"
//                                     controls
//                                     preload="metadata"
//                                   />
//                                 </div>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-3 pt-6">
//                       <button
//                         onClick={() => {
//                           closeModal();
//                           openProductEditModal(viewingProduct);
//                         }}
//                         className="btn-primary flex-1"
//                       >
//                         Edit Product
//                       </button>
//                       <button onClick={closeModal} className="btn-ghost flex-1">Close</button>
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === 'PRODUCT' && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//                         <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="label">Product Name *</label>
//                           <input type="text" name="name" value={productForm.name} onChange={handleProductInputChange} className="input-field" required />
//                         </div>
//                         <div>
//                             <label className="label">Category *</label>
//                             <select name="category" value={productForm.category} onChange={handleProductInputChange} className="input-field" required>
//                                 <option value="">Select Category</option>
//                                 {categories && categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="label">Subcategory *</label>
//                             <select name="subcategory" value={productForm.subcategory} onChange={handleProductInputChange} className="input-field" required disabled={!productForm.category}>
//                                 <option value="">Select Subcategory</option>
//                                 {availableSubCategories?.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>) || []}
//                             </select>
//                         </div>
//                         <div>
//                           <label className="label">Stock *</label>
//                           <input type="number" name="stock" value={productForm.stock} onChange={handleProductInputChange} className="input-field" required min="0"/>
//                         </div>
//                         <div>
//                          <label className="label">Price *</label>
// <input
//   type="number"
//   name="price"
//   value={productForm.price}
//   onChange={handleProductInputChange}
//   className="input-field"
//   min="0"
//   step="0.01"
//   required
// />
//                         </div>
//                         <div>
//                           <label className="label">Sale Price</label>
//                         <input
//   type="number"
//   name="salePrice"
//   value={productForm.salePrice}
//   onChange={handleProductInputChange}
//   className="input-field"
//   min="0.01"
//   step="0.01"
// />
//                         </div>
//                     </div>

//                     {/* Tag inputs for sizes and colors */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TagInput
//                         tags={sizeTags}
//                         onTagsChange={setSizeTags}
//                         label="Sizes"
//                         placeholder="Type size and press Enter (e.g., S, M, L)"
//                       />
//                       <TagInput
//                         tags={colorTags}
//                         onTagsChange={setColorTags}
//                         label="Colors"
//                         placeholder="Type color and press Enter (e.g., Red, Black)"
//                       />
//                     </div>

//                     <div>
//                       <label className="label">Description *</label>
//                       <textarea name="description" value={productForm.description} onChange={handleProductInputChange} className="input-field min-h-[100px]" required />
//                     </div>

//                     <div>
//                         <label className="label">
//   Images <span className="text-red-500">*</span>
// </label>
//                         <div className="flex items-center justify-center w-full mb-4">
//                             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                     <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                                     <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
//                                 </div>
//                                 <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
//                             </label>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {productForm.images.map((img, index) => (
//                                <div key={`exist-${index}`} className="relative aspect-square">
//                                   <img src={getImageUrl(img)} alt="Existing" className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50" />
//                                   <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                </div>
//                             ))}
//                             {previewUrls.map((url, index) => (
//                                 <div key={`new-${index}`} className="relative aspect-square">
//                                    <img src={url} alt="New Upload" className="w-full h-full object-cover rounded-lg opacity-80" />
//                                    <button type="button" onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"><FiX size={12}/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">Click or drag videos</span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {/* Existing videos */}
//                         {productForm.videos.map((video, index) => {
//                           const videoUrl = getVideoUrl(video);
//                           return videoUrl ? (
//                             <div key={`exist-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                               <video src={videoUrl} className="w-full h-full object-cover" muted />
//                               <button type="button" onClick={() => setProductForm(prev => ({...prev, videos: prev.videos.filter((_, i) => i !== index)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                                 <FiX size={12} />
//                               </button>
//                             </div>
//                           ) : null;
//                         })}

//                         {/* New video previews */}
//                         {videoPreviewUrls.map((url, index) => (
//                           <div key={`new-video-${index}`} className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
//                             <video src={url} className="w-full h-full object-cover" muted />
//                             <button type="button" onClick={() => removeVideo(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white">
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Update' : 'Create'}</button>
//                         <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === 'CATEGORY' && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? 'Edit Category' : 'Add New Category'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'} Category</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === 'SUBCATEGORY' && (
//                   <form onSubmit={handleSubCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
//                       </h2>
//                       <button type="button" onClick={closeModal}><FiX size={24} className="text-gray-400 hover:text-gray-900" /></button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select value={subCatForm.parentCategoryId} onChange={e => setSubCatForm({...subCatForm, parentCategoryId: e.target.value})} className="input-field" required>
//                         <option value="">Select Parent Category</option>
//                         {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input type="text" value={subCatForm.name} onChange={e => setSubCatForm({...subCatForm, name: e.target.value})} className="input-field" required/>
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea value={subCatForm.description} onChange={e => setSubCatForm({...subCatForm, description: e.target.value})} className="input-field"/>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">{editingSubCategory ? 'Update' : 'Create'} Subcategory</button>
//                       <button type="button" onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label {
//           @apply text-sm font-semibold text-gray-700 mb-2 block;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;

// import { useState, useEffect, useMemo, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiImage,
//   FiFolder,
//   FiGrid,
//   FiPause,
//   FiPlay,
//   FiEye,
//   FiSearch,
// } from "react-icons/fi";
// import { productApi } from "../../api/productApi";
// import { categoryApi, type Category } from "../../api/categoryApi";
// import type { Product } from "../../types";
// import toast from "react-hot-toast";
// import RichTextEditor from "../public/RichTextEditor"; // <-- IMPORT ADDED

// // --- CONFIGURATION ---
// const SERVER_URL =
//   import.meta.env.VITE_API_IMG_URL || "http://192.168.1.111:8090";

// // Define the modes for our modal system
// type ModalType =
//   | "NONE"
//   | "PRODUCT"
//   | "CATEGORY"
//   | "SUBCATEGORY"
//   | "PRODUCT_VIEW";
// type AdminTab = "CATEGORY" | "SUBCATEGORY" | "PRODUCT";

// type ProductFormState = {
//   name: string;
//   description: string;
//   price: string;
//   salePrice: string;
//   stock: string;
//   category: string;
//   subcategory: string;
//   images: string[];
//   videos: string[];
//   attributes: any[];
// };

// // Tag component for sizes and colors
// interface TagProps {
//   text: string;
//   onRemove: () => void;
// }

// const Tag = ({ text, onRemove }: TagProps) => {
//   return (
//     <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//       {text}
//       <button
//         type="button"
//         onClick={onRemove}
//         className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
//       >
//         <FiX size={14} />
//       </button>
//     </div>
//   );
// };

// // Tag input component
// interface TagInputProps {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder?: string;
//   label?: string;
// }

// const TagInput = ({
//   tags,
//   onTagsChange,
//   placeholder = "Type and press Enter",
//   label,
// }: TagInputProps) => {
//   const [inputValue, setInputValue] = useState("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     if (inputValue.trim()) {
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue("");
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-semibold text-gray-700">{label}</label>
//       )}
//       <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
//           ))}
//         </div>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onBlur={handleInputBlur}
//           placeholder={tags.length === 0 ? placeholder : ""}
//           className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
//         />
//       </div>
//       <p className="text-xs text-gray-400">Type and press Enter to add tags</p>
//     </div>
//   );
// };

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>("NONE");
//   const [activeTab, setActiveTab] = useState<AdminTab>("PRODUCT");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<ProductFormState>({
//     name: "",
//     description: "",
//     price: "",
//     salePrice: "",
//     stock: "",
//     category: "",
//     subcategory: "",
//     images: [],
//     videos: [],
//     attributes: [],
//   });

//   // New tag states
//   const [sizeTags, setSizeTags] = useState<string[]>([]);
//   const [colorTags, setColorTags] = useState<string[]>([]);

//   const [categoryForm, setCategoryForm] = useState({
//     name: "",
//     description: "",
//   });
//   const [subCatForm, setSubCatForm] = useState({
//     parentCategoryId: "",
//     name: "",
//     description: "",
//   });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: "",
//     subcategory: "",
//     category: "",
//     status: "",
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith("http") || path.startsWith("blob:")) return path;
//     return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
//   };

//   const getImageUrl = (path?: string) => {
//     const url = getMediaUrl(path);
//     return url || "/placeholder.jpg";
//   };

//   const getVideoUrl = (path?: string) => {
//     return getMediaUrl(path);
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories(),
//       ]);
//       setProducts(
//         Array.isArray(prodRes.content)
//           ? prodRes.content
//           : Array.isArray(prodRes)
//             ? prodRes
//             : [],
//       );
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error("Error fetching data:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to load data";
//       toast.error(errorMessage);
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories))
//       return [];
//     const category = categories.find((c) => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(
//         (cat) =>
//           cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//           cat.description
//             ?.toLowerCase()
//             .includes(columnFilters.item.toLowerCase()),
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .flatMap((cat) =>
//         (cat.subCategories || []).map((sub) => ({
//           ...sub,
//           parentName: cat.name,
//           parentId: cat.id,
//         })),
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(
//       (sub) =>
//         sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         (sub.parentName || "")
//           .toLowerCase()
//           .includes(columnFilters.item.toLowerCase()),
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter((prod) => {
//         const matchesItem = (prod.name || "")
//           .toLowerCase()
//           .includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || "")
//           .toLowerCase()
//           .includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || "")
//           .toLowerCase()
//           .includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === "" ||
//           (columnFilters.status === "ACTIVE" && prod.isActive) ||
//           (columnFilters.status === "INACTIVE" && !prod.isActive);

//         return (
//           matchesItem && matchesSubcategory && matchesCategory && matchesStatus
//         );
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage,
//     );
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories))
//       return [];
//     return filteredSubCategories.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage,
//     );
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === "CATEGORY"
//         ? filteredCategories?.length || 0
//         : activeTab === "SUBCATEGORY"
//           ? filteredSubCategories?.length || 0
//           : filteredProducts?.length || 0;

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [
//     activeTab,
//     filteredCategories,
//     filteredSubCategories,
//     filteredProducts,
//     rowsPerPage,
//   ]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal("PRODUCT_VIEW");
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || "",
//         description: product.description || "",
//         price: product.price != null ? String(product.price) : "",
//         salePrice: product.salePrice ? String(product.salePrice) : "",
//         stock: product.stock != null ? String(product.stock) : "",
//         category: product.category || "",
//         subcategory: product.subcategory || "",
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       const sizes =
//   product.attributes
//     ?.filter((attr: any) => attr.type === "SIZE")
//     .map((attr: any) => attr.value) || [];

// const colors =
//   product.attributes
//     ?.filter((attr: any) => attr.type === "COLOR")
//     .map((attr: any) => attr.value) || [];


//       setSizeTags(sizes);
//       setColorTags(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: "",
//         description: "",
//         price: "",
//         salePrice: "",
//         stock: "",
//         category: "",
//         subcategory: "",
//         images: [],
//         videos: [],
//         attributes: [],
//       });
//       setSizeTags([]);
//       setColorTags([]);
//     }
//     setActiveModal("PRODUCT");
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({
//         name: category.name || "",
//         description: category.description || "",
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", description: "" });
//     }
//     setActiveModal("CATEGORY");
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || "",
//         name: subCategory.name || "",
//         description: subCategory.description || "",
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: "", name: "", description: "" });
//     }
//     setActiveModal("SUBCATEGORY");
//   };

//   const closeModal = () => {
//     setActiveModal("NONE");
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles((prev) => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//       setPreviewUrls((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos((prev) => [...prev, ...files]);
//       const previews = files.map((file) => URL.createObjectURL(file));
//       setVideoPreviewUrls((prev) => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//     setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (productForm.salePrice === "0") {
//       toast.error("Sale price cannot be 0");
//       return;
//     }

//     const t = toast.loading(
//       editingProduct ? "Updating product..." : "Creating product...",
//     );

//     try {
//       const formData = new FormData();
//       const updatedAttributes: any[] = [];

//      sizeTags.forEach((size) =>
//   updatedAttributes.push({
//     type: "SIZE",
//     value: size.trim().toUpperCase(),
//   }),
// );

// colorTags.forEach((color) =>
//   updatedAttributes.push({
//     type: "COLOR",
//     value: color.trim().toUpperCase(),
//   }),
// );

//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price ? Number(productForm.price) : null,
//         salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
//         stock: productForm.stock ? Number(productForm.stock) : 0,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images,
//         videos: productForm.videos || [],
//         attributes: updatedAttributes,
//         isActive: editingProduct ? editingProduct.isActive : true,
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], {
//         type: "application/json",
//       });
//       formData.append("product", productBlob);

//       selectedFiles.forEach((file) => formData.append("imageFiles", file));
//       selectedVideos.forEach((video) => formData.append("videoFiles", video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, formData);
//         toast.success("Product updated successfully", { id: t });
//       } else {
//         await productApi.createProduct(formData);
//         toast.success("Product created successfully", { id: t });
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save product.";

//       if (error.response?.data?.errors) {
//         const validationErrors = Object.values(
//           error.response.data.errors,
//         ).flat();
//         validationErrors.forEach((err: any) => toast.error(err));
//       } else {
//         toast.error(errorMessage);
//       }
//     }
//   };

//   // UPDATED: Category form handler with API calls
//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     const t = toast.loading(
//       editingCategory ? "Updating category..." : "Creating category...",
//     );

//     try {
//       if (editingCategory) {
//         const updatedCat = await categoryApi.updateCategory(
//           editingCategory.id,
//           categoryForm.name,
//           categoryForm.description,
//         );

//         setCategories((prev) =>
//           prev
//             ? prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
//             : [],
//         );

//         toast.success(`Category '${updatedCat.name}' updated`, { id: t });
//       } else {
//         const newCat = await categoryApi.createCategory(
//           categoryForm.name,
//           categoryForm.description,
//         );
//         setCategories((prev) => (prev ? [...prev, newCat] : [newCat]));
//         toast.success(`Category '${newCat.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error("Category API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save category";

//       if (error.response?.status === 409) {
//         toast.error(`Category '${categoryForm.name}' already exists`, {
//           id: t,
//         });
//       } else {
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory form handler with API calls
//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name)
//       return toast.error("All fields required");

//     const t = toast.loading(
//       editingSubCategory
//         ? "Updating subcategory..."
//         : "Creating subcategory...",
//     );

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         const updatedSub = await categoryApi.updateSubCategory(
//           editingSubCategory.id,
//           subCatForm.name,
//           subCatForm.description,
//         );

//         setCategories((prev) =>
//           prev
//             ? prev.map((c) =>
//                 c.id === parentId
//                   ? {
//                       ...c,
//                       subCategories: (c.subCategories || []).map((sc) =>
//                         sc.id === editingSubCategory.id ? updatedSub : sc,
//                       ),
//                     }
//                   : c,
//               )
//             : [],
//         );

//         toast.success(`Subcategory '${updatedSub.name}' updated`, { id: t });
//       } else {
//         const newSub = await categoryApi.createSubCategory(
//           parentId,
//           subCatForm.name,
//           subCatForm.description,
//         );

//         const updatedCats = categories
//           ? categories.map((c) =>
//               c.id === parentId
//                 ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//                 : c,
//             )
//           : [];

//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error("Subcategory API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save subcategory";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm("Delete this product?")) return;
//     const t = toast.loading("Deleting product...");

//     try {
//       await productApi.deleteProduct(id);
//       toast.success("Product deleted", { id: t });
//       fetchData();
//     } catch (error: any) {
//       console.error("Delete product error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to delete product";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // UPDATED: Category delete handler with API call
//   const handleDeleteCategory = async (id: number, categoryName: string) => {
//     if (
//       !confirm(
//         `Delete category '${categoryName}'? This will also delete all subcategories.`,
//       )
//     )
//       return;

//     const t = toast.loading("Deleting category...");

//     try {
//       await categoryApi.deleteCategory(id);
//       setCategories((prev) => (prev ? prev.filter((c) => c.id !== id) : []));
//       toast.success(`Category '${categoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error("Delete category error:", error);

//       if (error.response?.status === 400) {
//         const errorMessage =
//           error.response?.data?.message ||
//           "Cannot delete category because it has subcategories";
//         toast.error(errorMessage, { id: t });
//       } else {
//         const errorMessage =
//           error.response?.data?.message ||
//           error.response?.data?.error ||
//           error.message ||
//           "Failed to delete category";
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory delete handler with API call
//   const handleDeleteSubCategory = async (
//     id: number,
//     subCategoryName: string,
//   ) => {
//     if (!confirm(`Delete subcategory '${subCategoryName}'?`)) return;

//     const t = toast.loading("Deleting subcategory...");

//     try {
//       await categoryApi.deleteSubCategory(id);

//       setCategories((prev) =>
//         prev
//           ? prev.map((c) => ({
//               ...c,
//               subCategories: (c.subCategories || []).filter(
//                 (sc) => sc.id !== id,
//               ),
//             }))
//           : [],
//       );

//       toast.success(`Subcategory '${subCategoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error("Delete subcategory error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to delete subcategory";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     const t = toast.loading(
//       currentStatus ? "Deactivating product..." : "Activating product...",
//     );

//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success("Product Deactivated ⏸", { id: t });
//       } else {
//         await productApi.activateProduct(id);
//         toast.success("Product Activated ▶", { id: t });
//       }
//       fetchData();
//     } catch (error: any) {
//       console.error("Toggle status error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to update status";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value } = e.target;

//     if (name === "category") {
//       setProductForm((prev) => ({
//         ...prev,
//         category: value,
//         subcategory: "",
//       }));
//       return;
//     }

//     setProductForm((prev) => ({
//       ...prev,
//       [name]: value === "" ? "" : value,
//     }));
//   };

//   // Handle rich text editor change
//   const handleDescriptionChange = (value: string) => {
//     setProductForm((prev) => ({
//       ...prev,
//       description: value,
//     }));
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters((prev) => ({
//       ...prev,
//       [column]: value,
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === "PRODUCT" &&
//               `${filteredProducts?.length || 0} products total`}
//             {activeTab === "CATEGORY" &&
//               `${filteredCategories?.length || 0} categories total`}
//             {activeTab === "SUBCATEGORY" &&
//               `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "PRODUCT" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("PRODUCT")}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "CATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("CATEGORY")}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "SUBCATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("SUBCATEGORY")}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === "CATEGORY" || activeTab === "SUBCATEGORY") && (
//         <div className="mb-6">
//           <div
//             className="
//             flex items-center space-x-2 p-3
//             bg-white
//             border-2 border-slate-400
//             rounded-lg
//             shadow-sm
//             focus-within:border-[#8FAE8B]
//             focus-within:ring-2 focus-within:ring-[#8FAE8B]/30
//           "
//           >
//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === "CATEGORY" ? "categories" : "subcategories"}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange("item", e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange("item", "")}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === "CATEGORY" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
//                             Sr. No.
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
//                             Name
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories &&
//                         paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || "-"}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteCategory(
//                                         category.id,
//                                         category.name,
//                                       )
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={4}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === "SUBCATEGORY" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
//                             Sr. No.
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
//                             Name
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
//                             Category
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories &&
//                         paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || "-"}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteSubCategory(sub.id, sub.name)
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={5}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === "PRODUCT" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "item",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "subcategory",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Category"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.category}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "status",
//                                     e.target.value,
//                                   )
//                                 }
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">
//                                       {product.name}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">
//                                   {product.subcategory}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">
//                                   {product.category}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span
//                                   className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                                 >
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">
//                                     ₹
//                                     {product.price != null
//                                       ? product.price.toFixed(2)
//                                       : "0.00"}
//                                   </div>
//                                   {product.salePrice != null &&
//                                     product.salePrice > 0 && (
//                                       <div className="text-xs text-red-600 line-through">
//                                         ₹{product.salePrice.toFixed(2)}
//                                       </div>
//                                     )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span
//                                   className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                                 >
//                                   {product.isActive ? "ACTIVE" : "INACTIVE"}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() =>
//                                       openProductViewModal(product)
//                                     }
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       openProductEditModal(product)
//                                     }
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleToggleStatus(
//                                         product.id,
//                                         product.isActive,
//                                       )
//                                     }
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={
//                                       product.isActive
//                                         ? "Deactivate"
//                                         : "Activate"
//                                     }
//                                   >
//                                     {product.isActive ? (
//                                       <FiPause size={16} />
//                                     ) : (
//                                       <FiPlay size={16} />
//                                     )}
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteProduct(product.id)
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={7}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               {loading
//                                 ? "Loading products..."
//                                 : "No products found"}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">
//                       {(page - 1) * rowsPerPage + 1}
//                     </span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === "CATEGORY"
//                           ? filteredCategories?.length || 0
//                           : activeTab === "SUBCATEGORY"
//                             ? filteredSubCategories?.length || 0
//                             : filteredProducts?.length || 0,
//                       )}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">
//                       {activeTab === "CATEGORY"
//                         ? filteredCategories?.length || 0
//                         : activeTab === "SUBCATEGORY"
//                           ? filteredSubCategories?.length || 0
//                           : filteredProducts?.length || 0}
//                     </span>{" "}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav
//                   className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                   aria-label="Pagination"
//                 >
//                   <button
//                     onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? "z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]"
//                           : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() =>
//                       setPage((prev) => Math.min(totalPages, prev + 1))
//                     }
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== "NONE" && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeModal}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200"
//               >
//                 {/* PRODUCT VIEW MODAL */}
//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === "PRODUCT_VIEW" && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Product Details
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">
//                           Product Information
//                         </h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">
//                               {viewingProduct.name}
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>

//                             <div
//                               className="input-field bg-gray-50 min-h-[100px] p-3 overflow-auto rich-text-content"
//                               style={{
//                                 maxHeight: "300px",
//                                 lineHeight: "1.6",
//                                 fontFamily: "inherit",
//                               }}
//                               dangerouslySetInnerHTML={{
//                                 __html:
//                                   viewingProduct.description ||
//                                   "<span class='text-gray-400'>No description</span>",
//                               }}
//                             />
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.category}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.subcategory}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Rest of your view modal code remains the same... */}
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">
//                           Pricing & Stock
//                         </h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">
//                                 ₹
//                                 {viewingProduct.price != null
//                                   ? viewingProduct.price.toFixed(2)
//                                   : "0.00"}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice != null &&
//                                 viewingProduct.salePrice > 0
//                                   ? `₹${viewingProduct.salePrice.toFixed(2)}`
//                                   : "Not on sale"}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">
//                               {viewingProduct.stock}
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div
//                               className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                             >
//                               {viewingProduct.isActive ? "ACTIVE" : "INACTIVE"}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags display in view mode */}
//                         {viewingProduct.attributes &&
//                           viewingProduct.attributes.length > 0 && (
//                             <div className="mt-6">
//                               <h3 className="text-lg font-semibold mb-2">
//                                 Attributes
//                               </h3>
//                               <div className="space-y-4">
//                                 <div>
//                                   <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                                     Sizes
//                                   </label>
//                                   <div className="flex flex-wrap gap-2">
//                                     {viewingProduct.attributes
//   ?.filter((attr: any) => attr.type === "SIZE")
//   .map((attr: any, index: number) => (
//                                         <div
//                                           key={index}
//                                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
//                                         >
//                                           {attr.value}
//                                         </div>
//                                       ))}
//                                    {viewingProduct.attributes?.filter(
//   (attr: any) => attr.type === "SIZE",
// ).length === 0 && (
//                                       <span className="text-gray-400 text-sm">
//                                         No sizes specified
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                                     Colors
//                                   </label>
//                                   <div className="flex flex-wrap gap-2">
//                                     {viewingProduct.attributes
//   ?.filter((attr: any) => attr.type === "COLOR")
//   .map((attr: any, index: number) => (
//                                         <div
//                                           key={index}
//                                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
//                                         >
//                                           {attr.value}
//                                         </div>
//                                       ))}
//                                     {viewingProduct.attributes?.filter(
//   (attr: any) => attr.type === "COLOR",
// ).length === 0 && (

//                                       <span className="text-gray-400 text-sm">
//                                         No colors specified
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                       </div>
//                     </div>

//                     {/* Images and Videos in view mode */}
//                     <div className="space-y-6">
//                       {viewingProduct.images &&
//                         viewingProduct.images.length > 0 && (
//                           <div>
//                             <h3 className="text-lg font-semibold mb-2">
//                               Product Images
//                             </h3>
//                             <div className="grid grid-cols-4 gap-2">
//                               {viewingProduct.images.map((img, index) => (
//                                 <div
//                                   key={index}
//                                   className="relative aspect-square"
//                                 >
//                                   <img
//                                     src={getImageUrl(img)}
//                                     alt={`Product ${index + 1}`}
//                                     className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {viewingProduct.videos &&
//                         viewingProduct.videos.length > 0 && (
//                           <div>
//                             <h3 className="text-lg font-semibold mb-2">
//                               Product Videos
//                             </h3>
//                             <div className="grid grid-cols-2 gap-2">
//                               {viewingProduct.videos.map((video, index) => {
//                                 const videoUrl = getVideoUrl(video);
//                                 return videoUrl ? (
//                                   <div
//                                     key={index}
//                                     className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
//                                   >
//                                     <video
//                                       src={videoUrl}
//                                       className="w-full h-full object-cover"
//                                       controls
//                                       preload="metadata"
//                                     />
//                                   </div>
//                                 ) : null;
//                               })}
//                             </div>
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === "PRODUCT" && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingProduct ? "Edit Product" : "Add New Product"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="label">Product Name *</label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={productForm.name}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Category *</label>
//                         <select
//                           name="category"
//                           value={productForm.category}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                         >
//                           <option value="">Select Category</option>
//                           {categories &&
//                             categories.map((cat) => (
//                               <option key={cat.id} value={cat.name}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="label">Subcategory *</label>
//                         <select
//                           name="subcategory"
//                           value={productForm.subcategory}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                           disabled={!productForm.category}
//                         >
//                           <option value="">Select Subcategory</option>
//                           {availableSubCategories?.map((sub) => (
//                             <option key={sub.id} value={sub.name}>
//                               {sub.name}
//                             </option>
//                           )) || []}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="label">Stock *</label>
//                         <input
//                           type="number"
//                           name="stock"
//                           value={productForm.stock}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                           min="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Price *</label>
//                         <input
//                           type="number"
//                           name="price"
//                           value={productForm.price}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           min="0"
//                           step="0.01"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Sale Price</label>
//                         <input
//                           type="number"
//                           name="salePrice"
//                           value={productForm.salePrice}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           min="0.01"
//                           step="0.01"
//                         />
//                       </div>
//                     </div>

//                     {/* Tag inputs for sizes and colors */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TagInput
//                         tags={sizeTags}
//                         onTagsChange={setSizeTags}
//                         label="Sizes"
//                         placeholder="Type size and press Enter (e.g., S, M, L)"
//                       />
//                       <TagInput
//                         tags={colorTags}
//                         onTagsChange={setColorTags}
//                         label="Colors"
//                         placeholder="Type color and press Enter (e.g., Red, Black)"
//                       />
//                     </div>

//                     <div>
//                       <label className="label">Description *</label>
//                       <RichTextEditor
//                         value={productForm.description}
//                         onChange={handleDescriptionChange}
//                         placeholder="Enter product description..."
//                       />
//                     </div>

//                     <div>
//                       <label className="label">
//                         Images <span className="text-red-500">*</span>
//                       </label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">
//                                 Click to upload
//                               </span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             onChange={handleFileChange}
//                             accept="image/*"
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {productForm.images.map((img, index) => (
//                           <div
//                             key={`exist-${index}`}
//                             className="relative aspect-square"
//                           >
//                             <img
//                               src={getImageUrl(img)}
//                               alt="Existing"
//                               className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setProductForm((prev) => ({
//                                   ...prev,
//                                   images: prev.images.filter(
//                                     (_, i) => i !== index,
//                                   ),
//                                 }))
//                               }
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                         {previewUrls.map((url, index) => (
//                           <div
//                             key={`new-${index}`}
//                             className="relative aspect-square"
//                           >
//                             <img
//                               src={url}
//                               alt="New Upload"
//                               className="w-full h-full object-cover rounded-lg opacity-80"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeFile(index)}
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">
//                                 Click or drag videos
//                               </span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {/* Existing videos */}
//                         {productForm.videos.map((video, index) => {
//                           const videoUrl = getVideoUrl(video);
//                           return videoUrl ? (
//                             <div
//                               key={`exist-video-${index}`}
//                               className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
//                             >
//                               <video
//                                 src={videoUrl}
//                                 className="w-full h-full object-cover"
//                                 muted
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setProductForm((prev) => ({
//                                     ...prev,
//                                     videos: prev.videos.filter(
//                                       (_, i) => i !== index,
//                                     ),
//                                   }))
//                                 }
//                                 className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                               >
//                                 <FiX size={12} />
//                               </button>
//                             </div>
//                           ) : null;
//                         })}

//                         {/* New video previews */}
//                         {videoPreviewUrls.map((url, index) => (
//                           <div
//                             key={`new-video-${index}`}
//                             className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
//                           >
//                             <video
//                               src={url}
//                               className="w-full h-full object-cover"
//                               muted
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeVideo(index)}
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingProduct ? "Update" : "Create"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === "CATEGORY" && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? "Edit Category" : "Add New Category"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input
//                         type="text"
//                         value={categoryForm.name}
//                         onChange={(e) =>
//                           setCategoryForm({
//                             ...categoryForm,
//                             name: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea
//                         value={categoryForm.description}
//                         onChange={(e) =>
//                           setCategoryForm({
//                             ...categoryForm,
//                             description: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                       />
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingCategory ? "Update" : "Create"} Category
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === "SUBCATEGORY" && (
//                   <form
//                     onSubmit={handleSubCategorySubmit}
//                     className="space-y-4"
//                   >
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory
//                           ? "Edit Subcategory"
//                           : "Add New Subcategory"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select
//                         value={subCatForm.parentCategoryId}
//                         onChange={(e) =>
//                           setSubCatForm({
//                             ...subCatForm,
//                             parentCategoryId: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                         required
//                       >
//                         <option value="">Select Parent Category</option>
//                         {categories &&
//                           categories.map((cat) => (
//                             <option key={cat.id} value={cat.id}>
//                               {cat.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input
//                         type="text"
//                         value={subCatForm.name}
//                         onChange={(e) =>
//                           setSubCatForm({ ...subCatForm, name: e.target.value })
//                         }
//                         className="input-field"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea
//                         value={subCatForm.description}
//                         onChange={(e) =>
//                           setSubCatForm({
//                             ...subCatForm,
//                             description: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                       />
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingSubCategory ? "Update" : "Create"} Subcategory
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label { 
//           @apply text-sm font-semibold text-gray-700 mb-2 block; 
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
        
//         /* Rich Text Editor Specific Styles */
//         .rich-text-editor {
//           line-height: 1.6;
//           font-family: inherit;
//         }
        
//         .rich-text-editor:empty::before {
//           content: attr(data-placeholder);
//           color: #9CA3AF;
//           pointer-events: none;
//         }
        
//         .rich-text-editor h1 {
//           font-size: 1.875rem;
//           font-weight: bold;
//           margin-top: 1rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor h2 {
//           font-size: 1.5rem;
//           font-weight: bold;
//           margin-top: 0.75rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor h3 {
//           font-size: 1.25rem;
//           font-weight: bold;
//           margin-top: 0.5rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor p {
//           margin-bottom: 1rem;
//         }
        
//         .rich-text-editor ul,
//         .rich-text-editor ol {
//           padding-left: 1.5rem;
//           margin-bottom: 1rem;
//         }
        
//         .rich-text-editor ul {
//           list-style-type: disc;
//         }
        
//         .rich-text-editor ol {
//           list-style-type: decimal;
//         }
        
//         .rich-text-editor li {
//           margin-bottom: 0.25rem;
//         }
        
//         .rich-text-editor strong,
//         .rich-text-editor b {
//           font-weight: bold;
//         }
        
//         .rich-text-editor em,
//         .rich-text-editor i {
//           font-style: italic;
//         }
        
//         .rich-text-editor u {
//           text-decoration: underline;
//         }
        
//         /* Rich text content display */
//         .rich-text-content {
//           line-height: 1.6;
//         }
        
//         .rich-text-content h1,
//         .rich-text-content h2,
//         .rich-text-content h3 {
//           @apply font-bold mt-2 mb-1;
//         }
        
//         .rich-text-content h1 {
//           @apply text-xl;
//         }
        
//         .rich-text-content h2 {
//           @apply text-lg;
//         }
        
//         .rich-text-content h3 {
//           @apply text-base;
//         }
        
//         .rich-text-content ul,
//         .rich-text-content ol {
//           @apply pl-5 my-2;
//         }
        
//         .rich-text-content ul {
//           @apply list-disc;
//         }
        
//         .rich-text-content ol {
//           @apply list-decimal;
//         }
        
//         .rich-text-content strong {
//           @apply font-bold;
//         }
        
//         .rich-text-content em {
//           @apply italic;
//         }
        
//         .rich-text-content u {
//           @apply underline;
//         }
        
//         .rich-text-content a {
//           @apply text-blue-600 hover:underline;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;



// import { useState, useEffect, useMemo, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiImage,
//   FiFolder,
//   FiGrid,
//   FiPause,
//   FiPlay,
//   FiEye,
//   FiSearch,
//   FiMessageSquare,
//   FiStar,
//   FiUser,
//   FiCalendar,
//   FiCheck,
//   FiVideo,
//   FiRefreshCw,
// } from "react-icons/fi";
// import { productApi } from "../../api/productApi";
// import { categoryApi, type Category } from "../../api/categoryApi";
// import reviewApi, { type Review, type ReviewUpdatePayload } from "../../api/reviewApi";
// import type { Product } from "../../types";
// import toast from "react-hot-toast";
// import RichTextEditor from "../public/RichTextEditor";
// import { format } from "date-fns";

// // --- CONFIGURATION ---
// const SERVER_URL =
//   import.meta.env.VITE_API_IMG_URL || "http://192.168.1.111:8090";

// // Define the modes for our modal system
// type ModalType =
//   | "NONE"
//   | "PRODUCT"
//   | "CATEGORY"
//   | "SUBCATEGORY"
//   | "PRODUCT_VIEW"
//   | "REVIEWS";

// type AdminTab = "CATEGORY" | "SUBCATEGORY" | "PRODUCT";

// type ProductFormState = {
//   name: string;
//   description: string;
//   price: string;
//   salePrice: string;
//   stock: string;
//   category: string;
//   subcategory: string;
//   images: string[];
//   videos: string[];
//   attributes: any[];
// };

// // Tag component for sizes and colors
// interface TagProps {
//   text: string;
//   onRemove: () => void;
// }

// const Tag = ({ text, onRemove }: TagProps) => {
//   return (
//     <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
//       {text}
//       <button
//         type="button"
//         onClick={onRemove}
//         className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
//       >
//         <FiX size={14} />
//       </button>
//     </div>
//   );
// };

// // Tag input component
// interface TagInputProps {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder?: string;
//   label?: string;
// }

// const TagInput = ({
//   tags,
//   onTagsChange,
//   placeholder = "Type and press Enter",
//   label,
// }: TagInputProps) => {
//   const [inputValue, setInputValue] = useState("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     if (inputValue.trim()) {
//       if (!tags.includes(inputValue.trim())) {
//         onTagsChange([...tags, inputValue.trim()]);
//       }
//       setInputValue("");
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-semibold text-gray-700">{label}</label>
//       )}
//       <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, index) => (
//             <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
//           ))}
//         </div>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onBlur={handleInputBlur}
//           placeholder={tags.length === 0 ? placeholder : ""}
//           className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
//         />
//       </div>
//       <p className="text-xs text-gray-400">Type and press Enter to add tags</p>
//     </div>
//   );
// };

// // Rating stars component
// const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <FiStar
//           key={i}
//           size={size}
//           className={`${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
//         />
//       ))}
//       <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
//     </div>
//   );
// };

// const AdminProducts = () => {
//   // --- DATA STATE ---
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   // --- REVIEW STATES ---
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
//   const [selectedProductName, setSelectedProductName] = useState("");
  
//   // Edit review states
//   const [showEditReviewModal, setShowEditReviewModal] = useState(false);
//   const [editingReview, setEditingReview] = useState<Review | null>(null);
//   const [editForm, setEditForm] = useState({
//     userId: 0,
//     rating: 5,
//     title: "",
//     body: "",
//   });
//   const [editImages, setEditImages] = useState<File[]>([]);
//   const [editVideos, setEditVideos] = useState<File[]>([]);
//   const [mediaIdsToDelete, setMediaIdsToDelete] = useState<number[]>([]);
  
//   // Filter and sort states for reviews
//   const [reviewFilters, setReviewFilters] = useState({
//     rating: "",
//     sortBy: "newest",
//     search: "",
//   });
  
//   // Pagination for reviews
//   const [reviewPage, setReviewPage] = useState(0);
//   const [reviewSize, setReviewSize] = useState(10);
//   const [totalReviews, setTotalReviews] = useState(0);

//   // --- MODAL STATE ---
//   const [activeModal, setActiveModal] = useState<ModalType>("NONE");
//   const [activeTab, setActiveTab] = useState<AdminTab>("PRODUCT");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

//   // --- FORMS STATE ---
//   const [productForm, setProductForm] = useState<ProductFormState>({
//     name: "",
//     description: "",
//     price: "",
//     salePrice: "",
//     stock: "",
//     category: "",
//     subcategory: "",
//     images: [],
//     videos: [],
//     attributes: [],
//   });

//   // New tag states
//   const [sizeTags, setSizeTags] = useState<string[]>([]);
//   const [colorTags, setColorTags] = useState<string[]>([]);

//   const [categoryForm, setCategoryForm] = useState({
//     name: "",
//     description: "",
//   });
//   const [subCatForm, setSubCatForm] = useState({
//     parentCategoryId: "",
//     name: "",
//     description: "",
//   });

//   // --- COLUMN FILTERS ---
//   const [columnFilters, setColumnFilters] = useState({
//     item: "",
//     subcategory: "",
//     category: "",
//     status: "",
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith("http") || path.startsWith("blob:")) return path;
//     return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
//   };

//   const getImageUrl = (path?: string) => {
//     const url = getMediaUrl(path);
//     return url || "/placeholder.jpg";
//   };

//   const getVideoUrl = (path?: string) => {
//     return getMediaUrl(path);
//   };

//   // --- INITIAL DATA FETCH ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [prodRes, catRes] = await Promise.all([
//         productApi.getAllProducts(0, 1000),
//         categoryApi.getAllCategories(),
//       ]);
//       setProducts(
//         Array.isArray(prodRes.content)
//           ? prodRes.content
//           : Array.isArray(prodRes)
//             ? prodRes
//             : [],
//       );
//       setCategories(Array.isArray(catRes) ? catRes : []);
//     } catch (error: any) {
//       console.error("Error fetching data:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to load data";
//       toast.error(errorMessage);
//       setProducts([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- REVIEW FUNCTIONS ---
//   const fetchProductReviews = async (productId: number, pageNum: number = 0) => {
//     setReviewsLoading(true);
//     try {
//       const response = await reviewApi.getProductReviews(productId, pageNum, reviewSize);
//       setReviews(response.content || []);
//       setTotalReviews(response.totalElements || 0);
//     } catch (error: any) {
//       console.error("Error fetching reviews:", error);
//       toast.error("Failed to load reviews");
//       setReviews([]);
//       setTotalReviews(0);
//     } finally {
//       setReviewsLoading(false);
//     }
//   };

//   const handleViewReviews = (productId: number, productName: string) => {
//     setSelectedProductId(productId);
//     setSelectedProductName(productName);
//     setActiveModal("REVIEWS");
//     setReviewPage(0);
//     fetchProductReviews(productId, 0);
//   };

//   const handleEditReview = (review: Review) => {
//     setEditingReview(review);
//     setEditForm({
//       userId: review.userId || 0,
//       rating: review.rating,
//       title: review.title || "",
//       body: review.body,
//     });
//     setEditImages([]);
//     setEditVideos([]);
//     setMediaIdsToDelete([]);
//     setShowEditReviewModal(true);
//   };

//   const handleUpdateReview = async () => {
//     if (!editingReview) return;

//     try {
//       const updatePayload: ReviewUpdatePayload = {
//         userId: editForm.userId,
//         rating: editForm.rating,
//         title: editForm.title,
//         body: editForm.body,
//       };

//       // Add media IDs to delete if any
//       if (mediaIdsToDelete.length > 0) {
//         updatePayload.mediaIdsToDelete = mediaIdsToDelete;
//       }

//       await reviewApi.updateReview(
//         editingReview.id,
//         updatePayload,
//         editImages.length > 0 ? editImages : undefined,
//         editVideos.length > 0 ? editVideos : undefined
//       );

//       toast.success("Review updated successfully");
//       setShowEditReviewModal(false);
      
//       // Refresh reviews if modal is open
//       if (selectedProductId) {
//         fetchProductReviews(selectedProductId, reviewPage);
//       }
//     } catch (error: any) {
//       console.error("Error updating review:", error);
//       toast.error("Failed to update review");
//     }
//   };

//   const handleDeleteReview = async (reviewId: number) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await reviewApi.deleteReview(reviewId);
//       toast.success("Review deleted successfully");
      
//       // Refresh reviews
//       if (selectedProductId) {
//         fetchProductReviews(selectedProductId, reviewPage);
//       }
//     } catch (error: any) {
//       console.error("Error deleting review:", error);
//       toast.error("Failed to delete review");
//     }
//   };

//   // Handle media deletion
//   const handleDeleteMedia = (mediaId: number) => {
//     setMediaIdsToDelete(prev => [...prev, mediaId]);
//   };

//   // Get all media from review (both existing and new)
//   const getAllMedia = (review: Review) => {
//     const existingImages = (review.media || [])
//       .filter(m => m.mediaType === 'IMAGE' && !mediaIdsToDelete.includes(m.id))
//       .map(m => m.url);
    
//     const existingVideos = (review.media || [])
//       .filter(m => m.mediaType === 'VIDEO' && !mediaIdsToDelete.includes(m.id))
//       .map(m => m.url);

//     return {
//       images: existingImages,
//       videos: existingVideos,
//     };
//   };

//   // Filter reviews based on current filters
//   const filteredReviews = reviews.filter(review => {
//     // Rating filter
//     if (reviewFilters.rating && review.rating !== parseInt(reviewFilters.rating)) {
//       return false;
//     }
    
//     // Search filter
//     if (reviewFilters.search) {
//       const searchTerm = reviewFilters.search.toLowerCase();
//       const matchesBody = review.body?.toLowerCase().includes(searchTerm);
//       const matchesTitle = review.title?.toLowerCase().includes(searchTerm);
//       const matchesUsername = review.username?.toLowerCase().includes(searchTerm);
      
//       if (!matchesBody && !matchesTitle && !matchesUsername) {
//         return false;
//       }
//     }
    
//     return true;
//   }).sort((a, b) => {
//     // Sort by date
//     if (reviewFilters.sortBy === "newest") {
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     } else {
//       return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//     }
//   });

//   // --- AVAILABLE SUBCATEGORIES ---
//   const availableSubCategories = useMemo(() => {
//     if (!productForm.category || !categories || !Array.isArray(categories))
//       return [];
//     const category = categories.find((c) => c.name === productForm.category);
//     return category?.subCategories || [];
//   }, [categories, productForm.category]);

//   // --- FILTERED DATA ---
//   const filteredCategories = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .filter(
//         (cat) =>
//           cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//           cat.description
//             ?.toLowerCase()
//             .includes(columnFilters.item.toLowerCase()),
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories, columnFilters.item]);

//   const subCategoryRows = useMemo(() => {
//     if (!categories || !Array.isArray(categories)) return [];
//     return categories
//       .flatMap((cat) =>
//         (cat.subCategories || []).map((sub) => ({
//           ...sub,
//           parentName: cat.name,
//           parentId: cat.id,
//         })),
//       )
//       .sort((a, b) => b.id - a.id);
//   }, [categories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
//     return subCategoryRows.filter(
//       (sub) =>
//         sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
//         (sub.parentName || "")
//           .toLowerCase()
//           .includes(columnFilters.item.toLowerCase()),
//     );
//   }, [subCategoryRows, columnFilters.item]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !Array.isArray(products)) return [];

//     return products
//       .filter((prod) => {
//         const matchesItem = (prod.name || "")
//           .toLowerCase()
//           .includes(columnFilters.item.toLowerCase());
//         const matchesSubcategory = (prod.subcategory || "")
//           .toLowerCase()
//           .includes(columnFilters.subcategory.toLowerCase());
//         const matchesCategory = (prod.category || "")
//           .toLowerCase()
//           .includes(columnFilters.category.toLowerCase());
//         const matchesStatus =
//           columnFilters.status === "" ||
//           (columnFilters.status === "ACTIVE" && prod.isActive) ||
//           (columnFilters.status === "INACTIVE" && !prod.isActive);

//         return (
//           matchesItem && matchesSubcategory && matchesCategory && matchesStatus
//         );
//       })
//       .sort((a, b) => b.id - a.id);
//   }, [products, columnFilters]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedCategories = useMemo(() => {
//     if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
//     return filteredCategories.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage,
//     );
//   }, [filteredCategories, page, rowsPerPage]);

//   const paginatedSubCategories = useMemo(() => {
//     if (!filteredSubCategories || !Array.isArray(filteredSubCategories))
//       return [];
//     return filteredSubCategories.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage,
//     );
//   }, [filteredSubCategories, page, rowsPerPage]);

//   const paginatedProducts = useMemo(() => {
//     if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
//     return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
//   }, [filteredProducts, page, rowsPerPage]);

//   const totalPages = useMemo(() => {
//     const itemCount =
//       activeTab === "CATEGORY"
//         ? filteredCategories?.length || 0
//         : activeTab === "SUBCATEGORY"
//           ? filteredSubCategories?.length || 0
//           : filteredProducts?.length || 0;

//     return Math.ceil(itemCount / rowsPerPage);
//   }, [
//     activeTab,
//     filteredCategories,
//     filteredSubCategories,
//     filteredProducts,
//     rowsPerPage,
//   ]);

//   // --- MODAL HANDLERS ---
//   const openProductViewModal = (product: Product) => {
//     setViewingProduct(product);
//     setActiveModal("PRODUCT_VIEW");
//   };

//   const openProductEditModal = (product?: Product) => {
//     if (product) {
//       setEditingProduct(product);
//       setProductForm({
//         name: product.name || "",
//         description: product.description || "",
//         price: product.price != null ? String(product.price) : "",
//         salePrice: product.salePrice ? String(product.salePrice) : "",
//         stock: product.stock != null ? String(product.stock) : "",
//         category: product.category || "",
//         subcategory: product.subcategory || "",
//         images: product.images || [],
//         videos: product.videos || [],
//         attributes: product.attributes || [],
//       });

//       const sizes =
//         product.attributes
//           ?.filter((attr: any) => attr.type === "SIZE")
//           .map((attr: any) => attr.value) || [];

//       const colors =
//         product.attributes
//           ?.filter((attr: any) => attr.type === "COLOR")
//           .map((attr: any) => attr.value) || [];

//       setSizeTags(sizes);
//       setColorTags(colors);
//     } else {
//       setEditingProduct(null);
//       setProductForm({
//         name: "",
//         description: "",
//         price: "",
//         salePrice: "",
//         stock: "",
//         category: "",
//         subcategory: "",
//         images: [],
//         videos: [],
//         attributes: [],
//       });
//       setSizeTags([]);
//       setColorTags([]);
//     }
//     setActiveModal("PRODUCT");
//   };

//   const openCategoryModal = (category?: Category) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({
//         name: category.name || "",
//         description: category.description || "",
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", description: "" });
//     }
//     setActiveModal("CATEGORY");
//   };

//   const openSubCategoryModal = (subCategory?: any) => {
//     if (subCategory) {
//       setEditingSubCategory(subCategory);
//       setSubCatForm({
//         parentCategoryId: subCategory.parentId?.toString() || "",
//         name: subCategory.name || "",
//         description: subCategory.description || "",
//       });
//     } else {
//       setEditingSubCategory(null);
//       setSubCatForm({ parentCategoryId: "", name: "", description: "" });
//     }
//     setActiveModal("SUBCATEGORY");
//   };

//   const closeModal = () => {
//     setActiveModal("NONE");
//     setEditingProduct(null);
//     setViewingProduct(null);
//     setEditingCategory(null);
//     setEditingSubCategory(null);
//     setSelectedFiles([]);
//     setPreviewUrls([]);
//     setSelectedVideos([]);
//     setVideoPreviewUrls([]);
//   };

//   // --- FILE HANDLERS ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setSelectedFiles((prev) => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//       setPreviewUrls((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedVideos((prev) => [...prev, ...files]);
//       const previews = files.map((file) => URL.createObjectURL(file));
//       setVideoPreviewUrls((prev) => [...prev, ...previews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//     setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeVideo = (index: number) => {
//     setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
//     setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   // --- FORM SUBMIT HANDLERS ---
//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (productForm.salePrice === "0") {
//       toast.error("Sale price cannot be 0");
//       return;
//     }

//     const t = toast.loading(
//       editingProduct ? "Updating product..." : "Creating product...",
//     );

//     try {
//       const formData = new FormData();
//       const updatedAttributes: any[] = [];

//       sizeTags.forEach((size) =>
//         updatedAttributes.push({
//           type: "SIZE",
//           value: size.trim().toUpperCase(),
//         }),
//       );

//       colorTags.forEach((color) =>
//         updatedAttributes.push({
//           type: "COLOR",
//           value: color.trim().toUpperCase(),
//         }),
//       );

//       const productData = {
//         name: productForm.name,
//         description: productForm.description,
//         price: productForm.price ? Number(productForm.price) : null,
//         salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
//         stock: productForm.stock ? Number(productForm.stock) : 0,
//         category: productForm.category,
//         subcategory: productForm.subcategory,
//         images: productForm.images,
//         videos: productForm.videos || [],
//         attributes: updatedAttributes,
//         isActive: editingProduct ? editingProduct.isActive : true,
//       };

//       const productBlob = new Blob([JSON.stringify(productData)], {
//         type: "application/json",
//       });
//       formData.append("product", productBlob);

//       selectedFiles.forEach((file) => formData.append("imageFiles", file));
//       selectedVideos.forEach((video) => formData.append("videoFiles", video));

//       if (editingProduct) {
//         await productApi.updateProduct(editingProduct.id, formData);
//         toast.success("Product updated successfully", { id: t });
//       } else {
//         await productApi.createProduct(formData);
//         toast.success("Product created successfully", { id: t });
//       }

//       closeModal();
//       fetchData();
//     } catch (error: any) {
//       console.error("Submission Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save product.";

//       if (error.response?.data?.errors) {
//         const validationErrors = Object.values(
//           error.response.data.errors,
//         ).flat();
//         validationErrors.forEach((err: any) => toast.error(err));
//       } else {
//         toast.error(errorMessage);
//       }
//     }
//   };

//   // UPDATED: Category form handler with API calls
//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryForm.name) return toast.error("Name is required");

//     const t = toast.loading(
//       editingCategory ? "Updating category..." : "Creating category...",
//     );

//     try {
//       if (editingCategory) {
//         const updatedCat = await categoryApi.updateCategory(
//           editingCategory.id,
//           categoryForm.name,
//           categoryForm.description,
//         );

//         setCategories((prev) =>
//           prev
//             ? prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
//             : [],
//         );

//         toast.success(`Category '${updatedCat.name}' updated`, { id: t });
//       } else {
//         const newCat = await categoryApi.createCategory(
//           categoryForm.name,
//           categoryForm.description,
//         );
//         setCategories((prev) => (prev ? [...prev, newCat] : [newCat]));
//         toast.success(`Category '${newCat.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error("Category API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save category";

//       if (error.response?.status === 409) {
//         toast.error(`Category '${categoryForm.name}' already exists`, {
//           id: t,
//         });
//       } else {
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory form handler with API calls
//   const handleSubCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subCatForm.parentCategoryId || !subCatForm.name)
//       return toast.error("All fields required");

//     const t = toast.loading(
//       editingSubCategory
//         ? "Updating subcategory..."
//         : "Creating subcategory...",
//     );

//     try {
//       const parentId = Number(subCatForm.parentCategoryId);

//       if (editingSubCategory) {
//         const updatedSub = await categoryApi.updateSubCategory(
//           editingSubCategory.id,
//           subCatForm.name,
//           subCatForm.description,
//         );

//         setCategories((prev) =>
//           prev
//             ? prev.map((c) =>
//                 c.id === parentId
//                   ? {
//                       ...c,
//                       subCategories: (c.subCategories || []).map((sc) =>
//                         sc.id === editingSubCategory.id ? updatedSub : sc,
//                       ),
//                     }
//                   : c,
//               )
//             : [],
//         );

//         toast.success(`Subcategory '${updatedSub.name}' updated`, { id: t });
//       } else {
//         const newSub = await categoryApi.createSubCategory(
//           parentId,
//           subCatForm.name,
//           subCatForm.description,
//         );

//         const updatedCats = categories
//           ? categories.map((c) =>
//               c.id === parentId
//                 ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
//                 : c,
//             )
//           : [];

//         setCategories(updatedCats);
//         toast.success(`Subcategory '${newSub.name}' created`, { id: t });
//       }
//       closeModal();
//     } catch (error: any) {
//       console.error("Subcategory API Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to save subcategory";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- DELETE HANDLERS ---
//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm("Delete this product?")) return;
//     const t = toast.loading("Deleting product...");

//     try {
//       await productApi.deleteProduct(id);
//       toast.success("Product deleted", { id: t });
//       fetchData();
//     } catch (error: any) {
//       console.error("Delete product error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to delete product";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // UPDATED: Category delete handler with API call
//   const handleDeleteCategory = async (id: number, categoryName: string) => {
//     if (
//       !confirm(
//         `Delete category '${categoryName}'? This will also delete all subcategories.`,
//       )
//     )
//       return;

//     const t = toast.loading("Deleting category...");

//     try {
//       await categoryApi.deleteCategory(id);
//       setCategories((prev) => (prev ? prev.filter((c) => c.id !== id) : []));
//       toast.success(`Category '${categoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error("Delete category error:", error);

//       if (error.response?.status === 400) {
//         const errorMessage =
//           error.response?.data?.message ||
//           "Cannot delete category because it has subcategories";
//         toast.error(errorMessage, { id: t });
//       } else {
//         const errorMessage =
//           error.response?.data?.message ||
//           error.response?.data?.error ||
//           error.message ||
//           "Failed to delete category";
//         toast.error(errorMessage, { id: t });
//       }
//     }
//   };

//   // UPDATED: Subcategory delete handler with API call
//   const handleDeleteSubCategory = async (
//     id: number,
//     subCategoryName: string,
//   ) => {
//     if (!confirm(`Delete subcategory '${subCategoryName}'?`)) return;

//     const t = toast.loading("Deleting subcategory...");

//     try {
//       await categoryApi.deleteSubCategory(id);

//       setCategories((prev) =>
//         prev
//           ? prev.map((c) => ({
//               ...c,
//               subCategories: (c.subCategories || []).filter(
//                 (sc) => sc.id !== id,
//               ),
//             }))
//           : [],
//       );

//       toast.success(`Subcategory '${subCategoryName}' deleted`, { id: t });
//     } catch (error: any) {
//       console.error("Delete subcategory error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to delete subcategory";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- TOGGLE STATUS ---
//   const handleToggleStatus = async (id: number, currentStatus: boolean) => {
//     const t = toast.loading(
//       currentStatus ? "Deactivating product..." : "Activating product...",
//     );

//     try {
//       if (currentStatus) {
//         await productApi.deactivateProduct(id);
//         toast.success("Product Deactivated ⏸", { id: t });
//       } else {
//         await productApi.activateProduct(id);
//         toast.success("Product Activated ▶", { id: t });
//       }
//       fetchData();
//     } catch (error: any) {
//       console.error("Toggle status error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to update status";
//       toast.error(errorMessage, { id: t });
//     }
//   };

//   // --- INPUT HANDLERS ---
//   const handleProductInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value } = e.target;

//     if (name === "category") {
//       setProductForm((prev) => ({
//         ...prev,
//         category: value,
//         subcategory: "",
//       }));
//       return;
//     }

//     setProductForm((prev) => ({
//       ...prev,
//       [name]: value === "" ? "" : value,
//     }));
//   };

//   // Handle rich text editor change
//   const handleDescriptionChange = (value: string) => {
//     setProductForm((prev) => ({
//       ...prev,
//       description: value,
//     }));
//   };

//   // --- COLUMN FILTER HANDLER ---
//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters((prev) => ({
//       ...prev,
//       [column]: value,
//     }));
//     setPage(1);
//   };

//   // --- ROWS PER PAGE OPTIONS ---
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="h-full flex flex-col">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             Product Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {activeTab === "PRODUCT" &&
//               `${filteredProducts?.length || 0} products total`}
//             {activeTab === "CATEGORY" &&
//               `${filteredCategories?.length || 0} categories total`}
//             {activeTab === "SUBCATEGORY" &&
//               `${filteredSubCategories?.length || 0} subcategories total`}
//           </p>
//         </div>

//         {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiFolder size={18} />
//             <span>Add Category</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openSubCategoryModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
//           >
//             <FiGrid size={18} />
//             <span>Add Subcategory</span>
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => openProductEditModal()}
//             className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
//           >
//             <FiPlus size={18} />
//             <span>Add Product</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "PRODUCT" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("PRODUCT")}
//         >
//           Products
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "CATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("CATEGORY")}
//         >
//           Categories
//         </button>
//         <button
//           className={`px-6 py-3 font-medium text-sm ${activeTab === "SUBCATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
//           onClick={() => setActiveTab("SUBCATEGORY")}
//         >
//           Subcategories
//         </button>
//       </div>

//       {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
//       {(activeTab === "CATEGORY" || activeTab === "SUBCATEGORY") && (
//         <div className="mb-6">
//           <div
//             className="
//             flex items-center space-x-2 p-3
//             bg-white
//             border-2 border-slate-400
//             rounded-lg
//             shadow-sm
//             focus-within:border-[#8FAE8B]
//             focus-within:ring-2 focus-within:ring-[#8FAE8B]/30
//           "
//           >
//             <FiSearch className="text-gray-500" size={20} />
//             <input
//               type="text"
//               placeholder={`Search ${activeTab === "CATEGORY" ? "categories" : "subcategories"}...`}
//               className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
//               value={columnFilters.item}
//               onChange={(e) => handleColumnFilterChange("item", e.target.value)}
//             />
//             {columnFilters.item && (
//               <button
//                 onClick={() => handleColumnFilterChange("item", "")}
//                 className="text-gray-500 hover:text-dark-700"
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
//       <div className="flex-1 flex flex-col min-h-0">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center py-8">Loading...</div>
//           </div>
//         ) : (
//           <>
//             {/* CATEGORY TABLE */}
//             {activeTab === "CATEGORY" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
//                             Sr. No.
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
//                             Name
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedCategories &&
//                         paginatedCategories.length > 0 ? (
//                           paginatedCategories.map((category, index) => (
//                             <tr key={category.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {category.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {category.description || "-"}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openCategoryModal(category)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteCategory(
//                                         category.id,
//                                         category.name,
//                                       )
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={4}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               No categories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* SUBCATEGORY TABLE */}
//             {activeTab === "SUBCATEGORY" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
//                             Sr. No.
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
//                             Name
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
//                             Category
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Description
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedSubCategories &&
//                         paginatedSubCategories.length > 0 ? (
//                           paginatedSubCategories.map((sub, index) => (
//                             <tr key={sub.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {(page - 1) * rowsPerPage + index + 1}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                 {sub.name}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 {sub.parentName}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="max-w-md break-words">
//                                   {sub.description || "-"}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => openSubCategoryModal(sub)}
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteSubCategory(sub.id, sub.name)
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={5}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               No subcategories found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT TABLE WITH COLUMN FILTERS */}
//             {activeTab === "PRODUCT" && (
//               <div className="flex-1 flex flex-col min-h-0">
//                 <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
//                   <div className="overflow-x-auto flex-1">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Item</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Item"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.item}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "item",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Subcategory</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Subcategory"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.subcategory}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "subcategory",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Category</span>
//                               <input
//                                 type="text"
//                                 placeholder="Search Category"
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                                 value={columnFilters.category}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "category",
//                                     e.target.value,
//                                   )
//                                 }
//                               />
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Stock</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Price</span>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
//                             <div className="flex flex-col">
//                               <span className="mb-1">Status</span>
//                               <select
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
//                                 value={columnFilters.status}
//                                 onChange={(e) =>
//                                   handleColumnFilterChange(
//                                     "status",
//                                     e.target.value,
//                                   )
//                                 }
//                               >
//                                 <option value="">All</option>
//                                 <option value="ACTIVE">Active</option>
//                                 <option value="INACTIVE">Inactive</option>
//                               </select>
//                             </div>
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {paginatedProducts && paginatedProducts.length > 0 ? (
//                           paginatedProducts.map((product) => (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3">
//                                 <div className="flex items-center">
//                                   <div className="h-10 w-10 flex-shrink-0 mr-3">
//                                     <img
//                                       src={getImageUrl(product.images?.[0])}
//                                       alt={product.name}
//                                       className="h-10 w-10 rounded object-cover border border-gray-200"
//                                     />
//                                   </div>
//                                   <div className="text-sm font-medium text-gray-900 max-w-[250px]">
//                                     <div className="break-words">
//                                       {product.name}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">
//                                   {product.subcategory}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
//                                 <div className="truncate">
//                                   {product.category}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span
//                                   className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                                 >
//                                   {product.stock}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-900">
//                                 <div className="flex flex-col">
//                                   <div className="font-semibold">
//                                     ₹
//                                     {product.price != null
//                                       ? product.price.toFixed(2)
//                                       : "0.00"}
//                                   </div>
//                                   {product.salePrice != null &&
//                                     product.salePrice > 0 && (
//                                       <div className="text-xs text-red-600 line-through">
//                                         ₹{product.salePrice.toFixed(2)}
//                                       </div>
//                                     )}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span
//                                   className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                                 >
//                                   {product.isActive ? "ACTIVE" : "INACTIVE"}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="flex space-x-1">
//                                   <button
//                                     onClick={() =>
//                                       openProductViewModal(product)
//                                     }
//                                     className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                                     title="View Details"
//                                   >
//                                     <FiEye size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       openProductEditModal(product)
//                                     }
//                                     className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleViewReviews(product.id, product.name)
//                                     }
//                                     className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
//                                     title="View Reviews"
//                                   >
//                                     <FiMessageSquare size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleToggleStatus(
//                                         product.id,
//                                         product.isActive,
//                                       )
//                                     }
//                                     className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
//                                     title={
//                                       product.isActive
//                                         ? "Deactivate"
//                                         : "Activate"
//                                     }
//                                   >
//                                     {product.isActive ? (
//                                       <FiPause size={16} />
//                                     ) : (
//                                       <FiPlay size={16} />
//                                     )}
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteProduct(product.id)
//                                     }
//                                     className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                                     title="Delete"
//                                   >
//                                     <FiTrash2 size={16} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={7}
//                               className="px-4 py-8 text-center text-gray-500"
//                             >
//                               {loading
//                                 ? "Loading products..."
//                                 : "No products found"}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- PAGINATION & ROWS PER PAGE --- */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-700">Rows per page:</span>
//                   <select
//                     className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
//                     value={rowsPerPage}
//                     onChange={(e) => {
//                       setRowsPerPage(Number(e.target.value));
//                       setPage(1);
//                     }}
//                   >
//                     {rowsPerPageOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">
//                       {(page - 1) * rowsPerPage + 1}
//                     </span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(
//                         page * rowsPerPage,
//                         activeTab === "CATEGORY"
//                           ? filteredCategories?.length || 0
//                           : activeTab === "SUBCATEGORY"
//                             ? filteredSubCategories?.length || 0
//                             : filteredProducts?.length || 0,
//                       )}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">
//                       {activeTab === "CATEGORY"
//                         ? filteredCategories?.length || 0
//                         : activeTab === "SUBCATEGORY"
//                           ? filteredSubCategories?.length || 0
//                           : filteredProducts?.length || 0}
//                     </span>{" "}
//                     results
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <nav
//                   className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                   aria-label="Pagination"
//                 >
//                   <button
//                     onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                     disabled={page === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setPage(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         page === i + 1
//                           ? "z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]"
//                           : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() =>
//                       setPage((prev) => Math.min(totalPages, prev + 1))
//                     }
//                     disabled={page === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- MODALS --- */}
//       <AnimatePresence>
//         {activeModal !== "NONE" && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeModal}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200"
//               >
//                 {/* PRODUCT VIEW MODAL */}
//                 {activeModal === "PRODUCT_VIEW" && viewingProduct && (
//                   <div className="space-y-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Product Details
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">
//                           Product Information
//                         </h3>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="label">Product Name</label>
//                             <div className="input-field bg-gray-50 break-words">
//                               {viewingProduct.name}
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Description</label>

//                             <div
//                               className="input-field bg-gray-50 min-h-[100px] p-3 overflow-auto rich-text-content"
//                               style={{
//                                 maxHeight: "300px",
//                                 lineHeight: "1.6",
//                                 fontFamily: "inherit",
//                               }}
//                               dangerouslySetInnerHTML={{
//                                 __html:
//                                   viewingProduct.description ||
//                                   "<span class='text-gray-400'>No description</span>",
//                               }}
//                             />
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Category</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.category}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="label">Subcategory</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.subcategory}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Rest of your view modal code remains the same... */}
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2">
//                           Pricing & Stock
//                         </h3>
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="label">Price</label>
//                               <div className="input-field bg-gray-50">
//                                 ₹
//                                 {viewingProduct.price != null
//                                   ? viewingProduct.price.toFixed(2)
//                                   : "0.00"}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="label">Sale Price</label>
//                               <div className="input-field bg-gray-50 break-words">
//                                 {viewingProduct.salePrice != null &&
//                                 viewingProduct.salePrice > 0
//                                   ? `₹${viewingProduct.salePrice.toFixed(2)}`
//                                   : "Not on sale"}
//                               </div>
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Stock</label>
//                             <div className="input-field bg-gray-50">
//                               {viewingProduct.stock}
//                             </div>
//                           </div>
//                           <div>
//                             <label className="label">Status</label>
//                             <div
//                               className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                             >
//                               {viewingProduct.isActive ? "ACTIVE" : "INACTIVE"}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Tags display in view mode */}
//                         {viewingProduct.attributes &&
//                           viewingProduct.attributes.length > 0 && (
//                             <div className="mt-6">
//                               <h3 className="text-lg font-semibold mb-2">
//                                 Attributes
//                               </h3>
//                               <div className="space-y-4">
//                                 <div>
//                                   <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                                     Sizes
//                                   </label>
//                                   <div className="flex flex-wrap gap-2">
//                                     {viewingProduct.attributes
//                                       ?.filter((attr: any) => attr.type === "SIZE")
//                                       .map((attr: any, index: number) => (
//                                         <div
//                                           key={index}
//                                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
//                                         >
//                                           {attr.value}
//                                         </div>
//                                       ))}
//                                     {viewingProduct.attributes?.filter(
//                                       (attr: any) => attr.type === "SIZE",
//                                     ).length === 0 && (
//                                       <span className="text-gray-400 text-sm">
//                                         No sizes specified
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                                     Colors
//                                   </label>
//                                   <div className="flex flex-wrap gap-2">
//                                     {viewingProduct.attributes
//                                       ?.filter((attr: any) => attr.type === "COLOR")
//                                       .map((attr: any, index: number) => (
//                                         <div
//                                           key={index}
//                                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
//                                         >
//                                           {attr.value}
//                                         </div>
//                                       ))}
//                                     {viewingProduct.attributes?.filter(
//                                       (attr: any) => attr.type === "COLOR",
//                                     ).length === 0 && (
//                                       <span className="text-gray-400 text-sm">
//                                         No colors specified
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                       </div>
//                     </div>

//                     {/* Images and Videos in view mode */}
//                     <div className="space-y-6">
//                       {viewingProduct.images &&
//                         viewingProduct.images.length > 0 && (
//                           <div>
//                             <h3 className="text-lg font-semibold mb-2">
//                               Product Images
//                             </h3>
//                             <div className="grid grid-cols-4 gap-2">
//                               {viewingProduct.images.map((img, index) => (
//                                 <div
//                                   key={index}
//                                   className="relative aspect-square"
//                                 >
//                                   <img
//                                     src={getImageUrl(img)}
//                                     alt={`Product ${index + 1}`}
//                                     className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       {viewingProduct.videos &&
//                         viewingProduct.videos.length > 0 && (
//                           <div>
//                             <h3 className="text-lg font-semibold mb-2">
//                               Product Videos
//                             </h3>
//                             <div className="grid grid-cols-2 gap-2">
//                               {viewingProduct.videos.map((video, index) => {
//                                 const videoUrl = getVideoUrl(video);
//                                 return videoUrl ? (
//                                   <div
//                                     key={index}
//                                     className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
//                                   >
//                                     <video
//                                       src={videoUrl}
//                                       className="w-full h-full object-cover"
//                                       controls
//                                       preload="metadata"
//                                     />
//                                   </div>
//                                 ) : null;
//                               })}
//                             </div>
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 )}

//                 {/* PRODUCT EDIT/CREATE MODAL */}
//                 {activeModal === "PRODUCT" && (
//                   <form onSubmit={handleProductSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingProduct ? "Edit Product" : "Add New Product"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="label">Product Name *</label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={productForm.name}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Category *</label>
//                         <select
//                           name="category"
//                           value={productForm.category}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                         >
//                           <option value="">Select Category</option>
//                           {categories &&
//                             categories.map((cat) => (
//                               <option key={cat.id} value={cat.name}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="label">Subcategory *</label>
//                         <select
//                           name="subcategory"
//                           value={productForm.subcategory}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                           disabled={!productForm.category}
//                         >
//                           <option value="">Select Subcategory</option>
//                           {availableSubCategories?.map((sub) => (
//                             <option key={sub.id} value={sub.name}>
//                               {sub.name}
//                             </option>
//                           )) || []}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="label">Stock *</label>
//                         <input
//                           type="number"
//                           name="stock"
//                           value={productForm.stock}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           required
//                           min="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Price *</label>
//                         <input
//                           type="number"
//                           name="price"
//                           value={productForm.price}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           min="0"
//                           step="0.01"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="label">Sale Price</label>
//                         <input
//                           type="number"
//                           name="salePrice"
//                           value={productForm.salePrice}
//                           onChange={handleProductInputChange}
//                           className="input-field"
//                           min="0.01"
//                           step="0.01"
//                         />
//                       </div>
//                     </div>

//                     {/* Tag inputs for sizes and colors */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TagInput
//                         tags={sizeTags}
//                         onTagsChange={setSizeTags}
//                         label="Sizes"
//                         placeholder="Type size and press Enter (e.g., S, M, L)"
//                       />
//                       <TagInput
//                         tags={colorTags}
//                         onTagsChange={setColorTags}
//                         label="Colors"
//                         placeholder="Type color and press Enter (e.g., Red, Black)"
//                       />
//                     </div>

//                     <div>
//                       <label className="label">Description *</label>
//                       <RichTextEditor
//                         value={productForm.description}
//                         onChange={handleDescriptionChange}
//                         placeholder="Enter product description..."
//                       />
//                     </div>

//                     <div>
//                       <label className="label">
//                         Images <span className="text-red-500">*</span>
//                       </label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">
//                                 Click to upload
//                               </span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             onChange={handleFileChange}
//                             accept="image/*"
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {productForm.images.map((img, index) => (
//                           <div
//                             key={`exist-${index}`}
//                             className="relative aspect-square"
//                           >
//                             <img
//                               src={getImageUrl(img)}
//                               alt="Existing"
//                               className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setProductForm((prev) => ({
//                                   ...prev,
//                                   images: prev.images.filter(
//                                     (_, i) => i !== index,
//                                   ),
//                                 }))
//                               }
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                         {previewUrls.map((url, index) => (
//                           <div
//                             key={`new-${index}`}
//                             className="relative aspect-square"
//                           >
//                             <img
//                               src={url}
//                               alt="New Upload"
//                               className="w-full h-full object-cover rounded-lg opacity-80"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeFile(index)}
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="label">Product Videos</label>
//                       <div className="flex items-center justify-center w-full mb-4">
//                         <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <FiImage className="w-8 h-8 mb-2 text-gray-400" />
//                             <p className="text-sm text-gray-400">
//                               <span className="font-semibold">
//                                 Click or drag videos
//                               </span>
//                             </p>
//                           </div>
//                           <input
//                             type="file"
//                             className="hidden"
//                             multiple
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2">
//                         {/* Existing videos */}
//                         {productForm.videos.map((video, index) => {
//                           const videoUrl = getVideoUrl(video);
//                           return videoUrl ? (
//                             <div
//                               key={`exist-video-${index}`}
//                               className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
//                             >
//                               <video
//                                 src={videoUrl}
//                                 className="w-full h-full object-cover"
//                                 muted
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setProductForm((prev) => ({
//                                     ...prev,
//                                     videos: prev.videos.filter(
//                                       (_, i) => i !== index,
//                                     ),
//                                   }))
//                                 }
//                                 className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                               >
//                                 <FiX size={12} />
//                               </button>
//                             </div>
//                           ) : null;
//                         })}

//                         {/* New video previews */}
//                         {videoPreviewUrls.map((url, index) => (
//                           <div
//                             key={`new-video-${index}`}
//                             className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
//                           >
//                             <video
//                               src={url}
//                               className="w-full h-full object-cover"
//                               muted
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeVideo(index)}
//                               className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingProduct ? "Update" : "Create"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* CATEGORY MODAL */}
//                 {activeModal === "CATEGORY" && (
//                   <form onSubmit={handleCategorySubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingCategory ? "Edit Category" : "Add New Category"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>
//                     <div>
//                       <label className="label">Category Name *</label>
//                       <input
//                         type="text"
//                         value={categoryForm.name}
//                         onChange={(e) =>
//                           setCategoryForm({
//                             ...categoryForm,
//                             name: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea
//                         value={categoryForm.description}
//                         onChange={(e) =>
//                           setCategoryForm({
//                             ...categoryForm,
//                             description: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                       />
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingCategory ? "Update" : "Create"} Category
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* SUBCATEGORY MODAL */}
//                 {activeModal === "SUBCATEGORY" && (
//                   <form
//                     onSubmit={handleSubCategorySubmit}
//                     className="space-y-4"
//                   >
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {editingSubCategory
//                           ? "Edit Subcategory"
//                           : "Add New Subcategory"}
//                       </h2>
//                       <button type="button" onClick={closeModal}>
//                         <FiX
//                           size={24}
//                           className="text-gray-400 hover:text-gray-900"
//                         />
//                       </button>
//                     </div>
//                     <div>
//                       <label className="label">Parent Category *</label>
//                       <select
//                         value={subCatForm.parentCategoryId}
//                         onChange={(e) =>
//                           setSubCatForm({
//                             ...subCatForm,
//                             parentCategoryId: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                         required
//                       >
//                         <option value="">Select Parent Category</option>
//                         {categories &&
//                           categories.map((cat) => (
//                             <option key={cat.id} value={cat.id}>
//                               {cat.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="label">Subcategory Name *</label>
//                       <input
//                         type="text"
//                         value={subCatForm.name}
//                         onChange={(e) =>
//                           setSubCatForm({ ...subCatForm, name: e.target.value })
//                         }
//                         className="input-field"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="label">Description</label>
//                       <textarea
//                         value={subCatForm.description}
//                         onChange={(e) =>
//                           setSubCatForm({
//                             ...subCatForm,
//                             description: e.target.value,
//                           })
//                         }
//                         className="input-field"
//                       />
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button type="submit" className="btn-primary flex-1">
//                         {editingSubCategory ? "Update" : "Create"} Subcategory
//                       </button>
//                       <button
//                         type="button"
//                         onClick={closeModal}
//                         className="btn-ghost flex-1"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* REVIEWS MODAL */}
//                 {activeModal === "REVIEWS" && (
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <div>
//                         <h2 className="text-2xl font-bold text-dark-900">
//                           Product Reviews
//                         </h2>
//                         <p className="text-dark-600 mt-1">
//                           {selectedProductName} • {totalReviews} review(s)
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => selectedProductId && fetchProductReviews(selectedProductId, reviewPage)}
//                           className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
//                           title="Refresh Reviews"
//                           disabled={reviewsLoading}
//                         >
//                           <FiRefreshCw
//                             className={reviewsLoading ? "animate-spin" : ""}
//                             size={18}
//                           />
//                         </button>
//                         <button onClick={closeModal}>
//                           <FiX
//                             size={24}
//                             className="text-dark-400 hover:text-dark-900"
//                           />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Review Filters */}
//                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div>
//                           <label className="text-sm font-semibold text-dark-500 mb-1 block">
//                             Filter by Rating
//                           </label>
//                           <select
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                             value={reviewFilters.rating}
//                             onChange={(e) => setReviewFilters(prev => ({ ...prev, rating: e.target.value }))}
//                           >
//                             <option value="">All Ratings</option>
//                             {[1, 2, 3, 4, 5].map(rating => (
//                               <option key={rating} value={rating}>
//                                 {rating} Star{rating !== 1 ? 's' : ''}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-sm font-semibold text-dark-500 mb-1 block">
//                             Sort by Date
//                           </label>
//                           <select
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                             value={reviewFilters.sortBy}
//                             onChange={(e) => setReviewFilters(prev => ({ ...prev, sortBy: e.target.value }))}
//                           >
//                             <option value="newest">Newest First</option>
//                             <option value="oldest">Oldest First</option>
//                           </select>
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="text-sm font-semibold text-dark-500 mb-1 block">
//                             Search Reviews
//                           </label>
//                           <div className="relative">
//                             <FiSearch className="absolute left-3 top-3 text-gray-400" />
//                             <input
//                               type="text"
//                               placeholder="Search by title, body, or username..."
//                               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                               value={reviewFilters.search}
//                               onChange={(e) => setReviewFilters(prev => ({ ...prev, search: e.target.value }))}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {reviewsLoading ? (
//                       <div className="flex justify-center items-center py-12">
//                         <div className="text-center">
//                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FAE8B] mb-4"></div>
//                           <p className="text-gray-600">Loading reviews...</p>
//                         </div>
//                       </div>
//                     ) : filteredReviews.length === 0 ? (
//                       <div className="text-center py-12 text-dark-500">
//                         <FiMessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
//                         <h3 className="text-xl font-medium mb-2">
//                           No Reviews Found
//                         </h3>
//                         <p className="text-gray-600">
//                           {reviewFilters.rating || reviewFilters.search 
//                             ? "Try adjusting your filters" 
//                             : "No reviews available for this product."}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {filteredReviews.map((review) => {
//                           const media = getAllMedia(review);
//                           return (
//                             <div
//                               key={review.id}
//                               className="border border-gray-200 rounded-xl p-5 hover:border-[#8FAE8B]/50 transition-colors"
//                             >
//                               <div className="flex items-start justify-between mb-4">
//                                 <div className="flex items-center gap-3">
//                                   <div className="p-2 bg-gray-100 rounded-lg">
//                                     <FiUser className="text-gray-600" size={20} />
//                                   </div>
//                                   <div>
//                                     <h4 className="font-semibold text-dark-900">
//                                       {review.username || "Anonymous User"}
//                                     </h4>
//                                     <StarRating rating={review.rating} size={14} />
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-sm text-gray-500">
//                                     <FiCalendar className="inline mr-1" />
//                                     {format(new Date(review.createdAt), "MMM dd, yyyy")}
//                                   </div>
//                                 </div>
//                               </div>

//                               {review.title && (
//                                 <h5 className="font-semibold text-dark-900 mb-2">
//                                   {review.title}
//                                 </h5>
//                               )}

//                               <p className="text-dark-700 mb-4">{review.body}</p>

//                               {/* Media Attachments */}
//                               {(media.images.length > 0 || media.videos.length > 0) && (
//                                 <div className="mb-4">
//                                   <p className="text-sm text-dark-500 mb-2">Attachments:</p>
//                                   <div className="flex flex-wrap gap-2">
//                                     {media.images.slice(0, 3).map((image, idx) => (
//                                       <div key={idx} className="relative group">
//                                         <img
//                                           src={getMediaUrl(image)}
//                                           alt={`Review image ${idx + 1}`}
//                                           className="h-20 w-20 object-cover rounded-lg border border-gray-200"
//                                         />
//                                       </div>
//                                     ))}
//                                     {media.videos.slice(0, 3).map((video, idx) => (
//                                       <div key={idx} className="relative group">
//                                         <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
//                                           <FiVideo className="text-gray-400" size={24} />
//                                           <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded">
//                                             MP4
//                                           </span>
//                                         </div>
//                                       </div>
//                                     ))}
//                                     {(media.images.length > 3 || media.videos.length > 3) && (
//                                       <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
//                                         <span className="text-sm text-gray-600">
//                                           +{(media.images.length - 3 || 0) + (media.videos.length - 3 || 0)} more
//                                         </span>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
//                                 <button
//                                   onClick={() => handleEditReview(review)}
//                                   className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                                 >
//                                   <FiEdit2 size={14} />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => handleDeleteReview(review.id)}
//                                   className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//                                 >
//                                   <FiTrash2 size={14} />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}

//                         {/* Review Pagination */}
//                         {totalReviews > reviewSize && (
//                           <div className="flex justify-center items-center gap-2 pt-6">
//                             <button
//                               onClick={() => setReviewPage(prev => Math.max(0, prev - 1))}
//                               disabled={reviewPage === 0}
//                               className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//                             >
//                               Previous
//                             </button>
//                             <span className="text-sm text-gray-600">
//                               Page {reviewPage + 1} of {Math.ceil(totalReviews / reviewSize)}
//                             </span>
//                             <button
//                               onClick={() => setReviewPage(prev => prev + 1)}
//                               disabled={(reviewPage + 1) * reviewSize >= totalReviews}
//                               className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//                             >
//                               Next
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* --- EDIT REVIEW MODAL (Separate Modal) --- */}
//       <AnimatePresence>
//         {showEditReviewModal && editingReview && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowEditReviewModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">
//                     Edit Review
//                   </h2>
//                   <button onClick={() => setShowEditReviewModal(false)}>
//                     <FiX
//                       size={24}
//                       className="text-dark-400 hover:text-dark-900"
//                     />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                       Rating
//                     </label>
//                     <div className="flex space-x-1">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <button
//                           key={star}
//                           type="button"
//                           onClick={() => setEditForm(prev => ({ ...prev, rating: star }))}
//                           className="text-2xl"
//                         >
//                           <FiStar
//                             className={`${star <= editForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                       Title
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                       value={editForm.title}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
//                       placeholder="Enter review title"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                       Review Body
//                     </label>
//                     <textarea
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B] min-h-[120px]"
//                       value={editForm.body}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
//                       placeholder="Enter your review"
//                     />
//                   </div>

//                   {/* Existing Media */}
//                   {editingReview.media && editingReview.media.length > 0 && (
//                     <div>
//                       <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                         Existing Media (Click to mark for deletion)
//                       </label>
//                       <div className="flex flex-wrap gap-2">
//                         {editingReview.media.map((media) => (
//                           <div
//                             key={media.id}
//                             className={`relative group cursor-pointer ${mediaIdsToDelete.includes(media.id) ? 'opacity-50' : ''}`}
//                             onClick={() => handleDeleteMedia(media.id)}
//                           >
//                             {media.mediaType === 'IMAGE' ? (
//                               <img
//                                 src={getMediaUrl(media.url)}
//                                 alt="Review media"
//                                 className="h-20 w-20 object-cover rounded-lg border border-gray-200"
//                               />
//                             ) : (
//                               <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
//                                 <FiVideo className="text-gray-400" size={24} />
//                               </div>
//                             )}
//                             {mediaIdsToDelete.includes(media.id) && (
//                               <div className="absolute inset-0 bg-red-100/50 flex items-center justify-center rounded-lg">
//                                 <FiX className="text-red-600" size={24} />
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       {mediaIdsToDelete.length > 0 && (
//                         <p className="text-sm text-red-600 mt-2">
//                           {mediaIdsToDelete.length} media item(s) marked for deletion
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   <div>
//                     <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                       Add New Images (Optional)
//                     </label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={(e) => setEditImages(Array.from(e.target.files || []))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                     />
//                     {editImages.length > 0 && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         {editImages.length} image(s) selected
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-dark-500 mb-2 block">
//                       Add New Videos (Optional)
//                     </label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="video/*"
//                       onChange={(e) => setEditVideos(Array.from(e.target.files || []))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
//                     />
//                     {editVideos.length > 0 && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         {editVideos.length} video(s) selected
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex space-x-3 pt-4">
//                     <button
//                       onClick={handleUpdateReview}
//                       className="flex-1 px-6 py-3 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A]"
//                     >
//                       Update Review
//                     </button>
//                     <button
//                       onClick={() => setShowEditReviewModal(false)}
//                       className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .label { 
//           @apply text-sm font-semibold text-gray-700 mb-2 block; 
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
//         }
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
        
//         /* Rich Text Editor Specific Styles */
//         .rich-text-editor {
//           line-height: 1.6;
//           font-family: inherit;
//         }
        
//         .rich-text-editor:empty::before {
//           content: attr(data-placeholder);
//           color: #9CA3AF;
//           pointer-events: none;
//         }
        
//         .rich-text-editor h1 {
//           font-size: 1.875rem;
//           font-weight: bold;
//           margin-top: 1rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor h2 {
//           font-size: 1.5rem;
//           font-weight: bold;
//           margin-top: 0.75rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor h3 {
//           font-size: 1.25rem;
//           font-weight: bold;
//           margin-top: 0.5rem;
//           margin-bottom: 0.5rem;
//         }
        
//         .rich-text-editor p {
//           margin-bottom: 1rem;
//         }
        
//         .rich-text-editor ul,
//         .rich-text-editor ol {
//           padding-left: 1.5rem;
//           margin-bottom: 1rem;
//         }
        
//         .rich-text-editor ul {
//           list-style-type: disc;
//         }
        
//         .rich-text-editor ol {
//           list-style-type: decimal;
//         }
        
//         .rich-text-editor li {
//           margin-bottom: 0.25rem;
//         }
        
//         .rich-text-editor strong,
//         .rich-text-editor b {
//           font-weight: bold;
//         }
        
//         .rich-text-editor em,
//         .rich-text-editor i {
//           font-style: italic;
//         }
        
//         .rich-text-editor u {
//           text-decoration: underline;
//         }
        
//         /* Rich text content display */
//         .rich-text-content {
//           line-height: 1.6;
//         }
        
//         .rich-text-content h1,
//         .rich-text-content h2,
//         .rich-text-content h3 {
//           @apply font-bold mt-2 mb-1;
//         }
        
//         .rich-text-content h1 {
//           @apply text-xl;
//         }
        
//         .rich-text-content h2 {
//           @apply text-lg;
//         }
        
//         .rich-text-content h3 {
//           @apply text-base;
//         }
        
//         .rich-text-content ul,
//         .rich-text-content ol {
//           @apply pl-5 my-2;
//         }
        
//         .rich-text-content ul {
//           @apply list-disc;
//         }
        
//         .rich-text-content ol {
//           @apply list-decimal;
//         }
        
//         .rich-text-content strong {
//           @apply font-bold;
//         }
        
//         .rich-text-content em {
//           @apply italic;
//         }
        
//         .rich-text-content u {
//           @apply underline;
//         }
        
//         .rich-text-content a {
//           @apply text-blue-600 hover:underline;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProducts;


import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiImage,
  FiFolder,
  FiGrid,
  FiPause,
  FiPlay,
  FiEye,
  FiSearch,
  FiMessageSquare,
  FiStar,
  FiUser,
  FiCalendar,
  FiVideo,
  FiRefreshCw,
} from "react-icons/fi";
import { productApi } from "../../api/productApi";
import { categoryApi, type Category } from "../../api/categoryApi";
import reviewApi, { type Review, type ReviewUpdatePayload } from "../../api/reviewApi";
import type { Product } from "../../types";
import toast from "react-hot-toast";
import RichTextEditor from "../public/RichTextEditor";
import { format } from "date-fns";

// --- CONFIGURATION ---
const SERVER_URL =
  import.meta.env.VITE_API_IMG_URL || "http://192.168.1.111:8090";

// Define the modes for our modal system
type ModalType =
  | "NONE"
  | "PRODUCT"
  | "CATEGORY"
  | "SUBCATEGORY"
  | "PRODUCT_VIEW"
  | "REVIEWS";

type AdminTab = "CATEGORY" | "SUBCATEGORY" | "PRODUCT";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  category: string;
  subcategory: string;
  images: string[];
  videos: string[];
  attributes: any[];
};

// Tag component for sizes and colors
interface TagProps {
  text: string;
  onRemove: () => void;
}

const Tag = ({ text, onRemove }: TagProps) => {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-[#8FAE8B] hover:text-[#7E9F7A] focus:outline-none"
      >
        <FiX size={14} />
      </button>
    </div>
  );
};

// Tag input component
interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

const TagInput = ({
  tags,
  onTagsChange,
  placeholder = "Type and press Enter",
  label,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B] bg-white">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Tag key={index} text={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="w-full px-2 py-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400">Type and press Enter to add tags</p>
    </div>
  );
};

// Rating stars component
const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={`${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const AdminProducts = () => {
  // --- DATA STATE ---
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // --- REVIEW STATES ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  
  // Edit review states
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    userId: 0,
    rating: 5,
    title: "",
    body: "",
  });
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editVideos, setEditVideos] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [removedVideos, setRemovedVideos] = useState<string[]>([]);
  
  // Filter and sort states for reviews
  const [reviewFilters, setReviewFilters] = useState({
    rating: "",
    sortBy: "newest",
    search: "",
  });
  
  // Pagination for reviews
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewSize] = useState(10);
  const [totalReviews, setTotalReviews] = useState(0);

  // --- MODAL STATE ---
  const [activeModal, setActiveModal] = useState<ModalType>("NONE");
  const [activeTab, setActiveTab] = useState<AdminTab>("PRODUCT");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

  // --- FORMS STATE ---
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "",
    subcategory: "",
    images: [],
    videos: [],
    attributes: [],
  });

  // New tag states
  const [sizeTags, setSizeTags] = useState<string[]>([]);
  const [colorTags, setColorTags] = useState<string[]>([]);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [subCatForm, setSubCatForm] = useState({
    parentCategoryId: "",
    name: "",
    description: "",
  });

  // --- COLUMN FILTERS ---
  const [columnFilters, setColumnFilters] = useState({
    item: "",
    subcategory: "",
    category: "",
    stock: "",
    status: "",
  });

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- HELPER: RESOLVE IMAGE/VIDEO URL ---
  const getMediaUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const getImageUrl = (path?: string) => {
    const url = getMediaUrl(path);
    return url || "/placeholder.jpg";
  };

  const getVideoUrl = (path?: string) => {
    return getMediaUrl(path);
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAllProducts(0, 1000),
        categoryApi.getAllCategories(),
      ]);
      setProducts(
        Array.isArray(prodRes.content)
          ? prodRes.content
          : Array.isArray(prodRes)
            ? prodRes
            : [],
      );
      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load data";
      toast.error(errorMessage);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // --- REVIEW FUNCTIONS ---
  const fetchProductReviews = async (productId: number, pageNum: number = 0) => {
    setReviewsLoading(true);
    try {
      const response = await reviewApi.getProductReviews(productId, pageNum, reviewSize);
      setReviews(response.content || []);
      setTotalReviews(response.totalElements || 0);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleViewReviews = (productId: number, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setActiveModal("REVIEWS");
    setReviewPage(0);
    fetchProductReviews(productId, 0);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      userId: review.userId || 0,
      rating: review.rating,
      title: review.title || "",
      body: review.body,
    });
    setEditImages([]);
    setEditVideos([]);
    setEditImagePreviews([]);
    setRemovedImages([]);
    setRemovedVideos([]);
    setShowEditReviewModal(true);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      const updatePayload: ReviewUpdatePayload = {
          rating: editForm.rating,
          title: editForm.title,
          body: editForm.body,
          videosToDelete: [],
          imagesToDelete: []
      };

      // Add URLs to delete if any
      if (removedImages.length > 0) {
        updatePayload.imagesToDelete = removedImages;
      }
      if (removedVideos.length > 0) {
        updatePayload.videosToDelete = removedVideos;
      }

      await reviewApi.updateReview(
        editingReview.id,
        updatePayload,
        editImages.length > 0 ? editImages : undefined,
        editVideos.length > 0 ? editVideos : undefined
      );

      toast.success("Review updated successfully");
      setShowEditReviewModal(false);
      
      // Refresh reviews if modal is open
      if (selectedProductId) {
        fetchProductReviews(selectedProductId, reviewPage);
      }
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewApi.deleteReview(reviewId);
      toast.success("Review deleted successfully");
      
      // Refresh reviews
      if (selectedProductId) {
        fetchProductReviews(selectedProductId, reviewPage);
      }
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Filter reviews based on current filters
  const filteredReviews = reviews.filter(review => {
    // Rating filter
    if (reviewFilters.rating && review.rating !== parseInt(reviewFilters.rating)) {
      return false;
    }
    
    // Search filter
    if (reviewFilters.search) {
      const searchTerm = reviewFilters.search.toLowerCase();
      const matchesBody = review.body?.toLowerCase().includes(searchTerm);
      const matchesTitle = review.title?.toLowerCase().includes(searchTerm);
      const matchesUsername = review.username?.toLowerCase().includes(searchTerm);
      
      if (!matchesBody && !matchesTitle && !matchesUsername) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by date
    if (reviewFilters.sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  // --- AVAILABLE SUBCATEGORIES ---
  const availableSubCategories = useMemo(() => {
    if (!productForm.category || !categories || !Array.isArray(categories))
      return [];
    const category = categories.find((c) => c.name === productForm.category);
    return category?.subCategories || [];
  }, [categories, productForm.category]);

  // --- FILTERED DATA ---
  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .filter(
        (cat) =>
          cat.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
          cat.description
            ?.toLowerCase()
            .includes(columnFilters.item.toLowerCase()),
      )
      .sort((a, b) => b.id - a.id);
  }, [categories, columnFilters.item]);

  const subCategoryRows = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .flatMap((cat) =>
        (cat.subCategories || []).map((sub) => ({
          ...sub,
          parentName: cat.name,
          parentId: cat.id,
        })),
      )
      .sort((a, b) => b.id - a.id);
  }, [categories]);

  const filteredSubCategories = useMemo(() => {
    if (!subCategoryRows || !Array.isArray(subCategoryRows)) return [];
    return subCategoryRows.filter(
      (sub) =>
        sub.name.toLowerCase().includes(columnFilters.item.toLowerCase()) ||
        (sub.parentName || "")
          .toLowerCase()
          .includes(columnFilters.item.toLowerCase()),
    );
  }, [subCategoryRows, columnFilters.item]);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products
      .filter((prod) => {
        const matchesItem = (prod.name || "")
          .toLowerCase()
          .includes(columnFilters.item.toLowerCase());
        const matchesSubcategory = (prod.subcategory || "")
          .toLowerCase()
          .includes(columnFilters.subcategory.toLowerCase());
        const matchesCategory = (prod.category || "")
          .toLowerCase()
          .includes(columnFilters.category.toLowerCase());
        const stockQuery = columnFilters.stock.trim().toLowerCase();
        const stockValue =
          prod.stock != null ? String(prod.stock).toLowerCase() : "";
        const stockLabel = (prod.stock || 0) > 0 ? "in stock" : "out of stock";
        const matchesStock =
          stockQuery === "" ||
          stockValue.includes(stockQuery) ||
          stockLabel.includes(stockQuery);
        const matchesStatus =
          columnFilters.status === "" ||
          (columnFilters.status === "ACTIVE" && prod.isActive) ||
          (columnFilters.status === "INACTIVE" && !prod.isActive);

        return (
          matchesItem &&
          matchesSubcategory &&
          matchesCategory &&
          matchesStock &&
          matchesStatus
        );
      })
      .sort((a, b) => b.id - a.id);
  }, [products, columnFilters]);

  // --- PAGINATION CALCULATIONS ---
  const paginatedCategories = useMemo(() => {
    if (!filteredCategories || !Array.isArray(filteredCategories)) return [];
    return filteredCategories.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage,
    );
  }, [filteredCategories, page, rowsPerPage]);

  const paginatedSubCategories = useMemo(() => {
    if (!filteredSubCategories || !Array.isArray(filteredSubCategories))
      return [];
    return filteredSubCategories.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage,
    );
  }, [filteredSubCategories, page, rowsPerPage]);

  const paginatedProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
    return filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const totalPages = useMemo(() => {
    const itemCount =
      activeTab === "CATEGORY"
        ? filteredCategories?.length || 0
        : activeTab === "SUBCATEGORY"
          ? filteredSubCategories?.length || 0
          : filteredProducts?.length || 0;

    return Math.ceil(itemCount / rowsPerPage);
  }, [
    activeTab,
    filteredCategories,
    filteredSubCategories,
    filteredProducts,
    rowsPerPage,
  ]);

  // --- MODAL HANDLERS ---
  const openProductViewModal = (product: Product) => {
    setViewingProduct(product);
    setActiveModal("PRODUCT_VIEW");
  };

  const openProductEditModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price != null ? String(product.price) : "",
        salePrice: product.salePrice ? String(product.salePrice) : "",
        stock: product.stock != null ? String(product.stock) : "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        images: product.images || [],
        videos: product.videos || [],
        attributes: product.attributes || [],
      });

      const sizes =
        product.attributes
          ?.filter((attr: any) => attr.type === "SIZE")
          .map((attr: any) => attr.value) || [];

      const colors =
        product.attributes
          ?.filter((attr: any) => attr.type === "COLOR")
          .map((attr: any) => attr.value) || [];

      setSizeTags(sizes);
      setColorTags(colors);
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        salePrice: "",
        stock: "",
        category: "",
        subcategory: "",
        images: [],
        videos: [],
        attributes: [],
      });
      setSizeTags([]);
      setColorTags([]);
    }
    setActiveModal("PRODUCT");
  };

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || "",
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "" });
    }
    setActiveModal("CATEGORY");
  };

  const openSubCategoryModal = (subCategory?: any) => {
    if (subCategory) {
      setEditingSubCategory(subCategory);
      setSubCatForm({
        parentCategoryId: subCategory.parentId?.toString() || "",
        name: subCategory.name || "",
        description: subCategory.description || "",
      });
    } else {
      setEditingSubCategory(null);
      setSubCatForm({ parentCategoryId: "", name: "", description: "" });
    }
    setActiveModal("SUBCATEGORY");
  };

  const closeModal = () => {
    setActiveModal("NONE");
    setEditingProduct(null);
    setViewingProduct(null);
    setEditingCategory(null);
    setEditingSubCategory(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSelectedVideos([]);
    setVideoPreviewUrls([]);
  };

  // --- FILE HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedVideos((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setVideoPreviewUrls((prev) => [...prev, ...previews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // --- FORM SUBMIT HANDLERS ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productForm.salePrice === "0") {
      toast.error("Sale price cannot be 0");
      return;
    }

    const t = toast.loading(
      editingProduct ? "Updating product..." : "Creating product...",
    );

    try {
      const formData = new FormData();
      const updatedAttributes: any[] = [];

      sizeTags.forEach((size) =>
        updatedAttributes.push({
          type: "SIZE",
          value: size.trim().toUpperCase(),
        }),
      );

      colorTags.forEach((color) =>
        updatedAttributes.push({
          type: "COLOR",
          value: color.trim().toUpperCase(),
        }),
      );

      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price ? Number(productForm.price) : null,
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
        stock: productForm.stock ? Number(productForm.stock) : 0,
        category: productForm.category,
        subcategory: productForm.subcategory,
        images: productForm.images,
        videos: productForm.videos || [],
        attributes: updatedAttributes,
        isActive: editingProduct ? editingProduct.isActive : true,
      };

      const productBlob = new Blob([JSON.stringify(productData)], {
        type: "application/json",
      });
      formData.append("product", productBlob);

      selectedFiles.forEach((file) => formData.append("imageFiles", file));
      selectedVideos.forEach((video) => formData.append("videoFiles", video));

      if (editingProduct) {
        await productApi.updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully", { id: t });
      } else {
        await productApi.createProduct(formData);
        toast.success("Product created successfully", { id: t });
      }

      closeModal();
      fetchData();
    } catch (error: any) {
      console.error("Submission Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save product.";

      if (error.response?.data?.errors) {
        const validationErrors = Object.values(
          error.response.data.errors,
        ).flat();
        validationErrors.forEach((err: any) => toast.error(err));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // UPDATED: Category form handler with API calls
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return toast.error("Name is required");

    const t = toast.loading(
      editingCategory ? "Updating category..." : "Creating category...",
    );

    try {
      if (editingCategory) {
        const updatedCat = await categoryApi.updateCategory(
          editingCategory.id,
          categoryForm.name,
          categoryForm.description,
        );

        setCategories((prev) =>
          prev
            ? prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
            : [],
        );

        toast.success(`Category '${updatedCat.name}' updated`, { id: t });
      } else {
        const newCat = await categoryApi.createCategory(
          categoryForm.name,
          categoryForm.description,
        );
        setCategories((prev) => (prev ? [...prev, newCat] : [newCat]));
        toast.success(`Category '${newCat.name}' created`, { id: t });
      }
      closeModal();
    } catch (error: any) {
      console.error("Category API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save category";

      if (error.response?.status === 409) {
        toast.error(`Category '${categoryForm.name}' already exists`, {
          id: t,
        });
      } else {
        toast.error(errorMessage, { id: t });
      }
    }
  };

  // UPDATED: Subcategory form handler with API calls
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCatForm.parentCategoryId || !subCatForm.name)
      return toast.error("All fields required");

    const t = toast.loading(
      editingSubCategory
        ? "Updating subcategory..."
        : "Creating subcategory...",
    );

    try {
      const parentId = Number(subCatForm.parentCategoryId);

      if (editingSubCategory) {
        const updatedSub = await categoryApi.updateSubCategory(
          editingSubCategory.id,
          subCatForm.name,
          subCatForm.description,
        );

        setCategories((prev) =>
          prev
            ? prev.map((c) =>
                c.id === parentId
                  ? {
                      ...c,
                      subCategories: (c.subCategories || []).map((sc) =>
                        sc.id === editingSubCategory.id ? updatedSub : sc,
                      ),
                    }
                  : c,
              )
            : [],
        );

        toast.success(`Subcategory '${updatedSub.name}' updated`, { id: t });
      } else {
        const newSub = await categoryApi.createSubCategory(
          parentId,
          subCatForm.name,
          subCatForm.description,
        );

        const updatedCats = categories
          ? categories.map((c) =>
              c.id === parentId
                ? { ...c, subCategories: [...(c.subCategories || []), newSub] }
                : c,
            )
          : [];

        setCategories(updatedCats);
        toast.success(`Subcategory '${newSub.name}' created`, { id: t });
      }
      closeModal();
    } catch (error: any) {
      console.error("Subcategory API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save subcategory";
      toast.error(errorMessage, { id: t });
    }
  };

  // --- DELETE HANDLERS ---
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const t = toast.loading("Deleting product...");

    try {
      await productApi.deleteProduct(id);
      toast.success("Product deleted", { id: t });
      fetchData();
    } catch (error: any) {
      console.error("Delete product error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete product";
      toast.error(errorMessage, { id: t });
    }
  };

  // UPDATED: Category delete handler with API call
  const handleDeleteCategory = async (id: number, categoryName: string) => {
    if (
      !confirm(
        `Delete category '${categoryName}'? This will also delete all subcategories.`,
      )
    )
      return;

    const t = toast.loading("Deleting category...");

    try {
      await categoryApi.deleteCategory(id);
      setCategories((prev) => (prev ? prev.filter((c) => c.id !== id) : []));
      toast.success(`Category '${categoryName}' deleted`, { id: t });
    } catch (error: any) {
      console.error("Delete category error:", error);

      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          "Cannot delete category because it has subcategories";
        toast.error(errorMessage, { id: t });
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete category";
        toast.error(errorMessage, { id: t });
      }
    }
  };

  // UPDATED: Subcategory delete handler with API call
  const handleDeleteSubCategory = async (
    id: number,
    subCategoryName: string,
  ) => {
    if (!confirm(`Delete subcategory '${subCategoryName}'?`)) return;

    const t = toast.loading("Deleting subcategory...");

    try {
      await categoryApi.deleteSubCategory(id);

      setCategories((prev) =>
        prev
          ? prev.map((c) => ({
              ...c,
              subCategories: (c.subCategories || []).filter(
                (sc) => sc.id !== id,
              ),
            }))
          : [],
      );

      toast.success(`Subcategory '${subCategoryName}' deleted`, { id: t });
    } catch (error: any) {
      console.error("Delete subcategory error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete subcategory";
      toast.error(errorMessage, { id: t });
    }
  };

  // --- TOGGLE STATUS ---
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const t = toast.loading(
      currentStatus ? "Deactivating product..." : "Activating product...",
    );

    try {
      if (currentStatus) {
        await productApi.deactivateProduct(id);
        toast.success("Product Deactivated ⏸", { id: t });
      } else {
        await productApi.activateProduct(id);
        toast.success("Product Activated ▶", { id: t });
      }
      fetchData();
    } catch (error: any) {
      console.error("Toggle status error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update status";
      toast.error(errorMessage, { id: t });
    }
  };

  // --- INPUT HANDLERS ---
  const handleProductInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProductForm((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
      }));
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : value,
    }));
  };

  // Handle rich text editor change
  const handleDescriptionChange = (value: string) => {
    setProductForm((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // --- COLUMN FILTER HANDLER ---
  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setPage(1);
  };

  // --- ROWS PER PAGE OPTIONS ---
  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    const isModalOpen = activeModal !== "NONE" || showEditReviewModal;
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal, showEditReviewModal]);

  return (
    <div className="h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">
            Product Management
          </h2>
          <p className="text-dark-600 mt-1">
            {activeTab === "PRODUCT" &&
              `${filteredProducts?.length || 0} products total`}
            {activeTab === "CATEGORY" &&
              `${filteredCategories?.length || 0} categories total`}
            {activeTab === "SUBCATEGORY" &&
              `${filteredSubCategories?.length || 0} subcategories total`}
          </p>
        </div>

        {/* ACTION BUTTONS - LIKE 2ND IMAGE */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openCategoryModal()}
            className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
          >
            <FiFolder size={18} />
            <span>Add Category</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openSubCategoryModal()}
            className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white border border-gray-300 text-dark-800 hover:bg-gray-50 transition-colors"
          >
            <FiGrid size={18} />
            <span>Add Subcategory</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openProductEditModal()}
            className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors"
          >
            <FiPlus size={18} />
            <span>Add Product</span>
          </motion.button>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "PRODUCT" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
          onClick={() => setActiveTab("PRODUCT")}
        >
          Products
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "CATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
          onClick={() => setActiveTab("CATEGORY")}
        >
          Categories
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "SUBCATEGORY" ? "border-b-2 border-[#8FAE8B] text-[#8FAE8B]" : "text-dark-600 hover:text-dark-900"}`}
          onClick={() => setActiveTab("SUBCATEGORY")}
        >
          Subcategories
        </button>
      </div>

      {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
      {(activeTab === "CATEGORY" || activeTab === "SUBCATEGORY") && (
        <div className="mb-6">
          <div
            className="
            flex items-center space-x-2 p-3
            bg-white
            border-2 border-slate-400
            rounded-lg
            shadow-sm
            focus-within:border-[#8FAE8B]
            focus-within:ring-2 focus-within:ring-[#8FAE8B]/30
          "
          >
            <FiSearch className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab === "CATEGORY" ? "categories" : "subcategories"}...`}
              className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
              value={columnFilters.item}
              onChange={(e) => handleColumnFilterChange("item", e.target.value)}
            />
            {columnFilters.item && (
              <button
                onClick={() => handleColumnFilterChange("item", "")}
                className="text-gray-500 hover:text-dark-700"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8">Loading...</div>
          </div>
        ) : (
          <>
            {/* CATEGORY TABLE */}
            {activeTab === "CATEGORY" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                            Sr. No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedCategories &&
                        paginatedCategories.length > 0 ? (
                          paginatedCategories.map((category, index) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {(page - 1) * rowsPerPage + index + 1}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {category.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <div className="max-w-md break-words">
                                  {category.description || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openCategoryModal(category)}
                                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteCategory(
                                        category.id,
                                        category.name,
                                      )
                                    }
                                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No categories found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBCATEGORY TABLE */}
            {activeTab === "SUBCATEGORY" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                            Sr. No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedSubCategories &&
                        paginatedSubCategories.length > 0 ? (
                          paginatedSubCategories.map((sub, index) => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {(page - 1) * rowsPerPage + index + 1}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {sub.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {sub.parentName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <div className="max-w-md break-words">
                                  {sub.description || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openSubCategoryModal(sub)}
                                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubCategory(sub.id, sub.name)
                                    }
                                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No subcategories found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT TABLE WITH COLUMN FILTERS */}
            {activeTab === "PRODUCT" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
                            <div className="flex flex-col">
                              <span className="mb-1">Item</span>
                              <input
                                type="text"
                                placeholder="Search Item"
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                                value={columnFilters.item}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    "item",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
                            <div className="flex flex-col">
                              <span className="mb-1">Subcategory</span>
                              <input
                                type="text"
                                placeholder="Search Subcategory"
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                                value={columnFilters.subcategory}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    "subcategory",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] max-w-[180px]">
                            <div className="flex flex-col">
                              <span className="mb-1">Category</span>
                              <input
                                type="text"
                                placeholder="Search Category"
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                                value={columnFilters.category}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    "category",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                            <div className="flex flex-col">
                              <span className="mb-1">Stock</span>
                              <input
                                type="text"
                                placeholder="Search Stock"
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                                value={columnFilters.stock}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    "stock",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                            <div className="flex flex-col">
                              <span className="mb-1">Price</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                            <div className="flex flex-col">
                              <span className="mb-1">Status</span>
                              <select
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] bg-white"
                                value={columnFilters.status}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    "status",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">All</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedProducts && paginatedProducts.length > 0 ? (
                          paginatedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                                    <img
                                      src={getImageUrl(product.images?.[0])}
                                      alt={product.name}
                                      className="h-10 w-10 rounded object-cover border border-gray-200"
                                    />
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 max-w-[250px]">
                                    <div className="break-words">
                                      {product.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
                                <div className="truncate">
                                  {product.subcategory}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px]">
                                <div className="truncate">
                                  {product.category}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                  {product.stock}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <div className="flex flex-col">
                                  <div className="font-semibold">
                                    ₹
                                    {product.salePrice != null &&
                                    product.salePrice > 0
                                      ? product.salePrice.toFixed(2)
                                      : product.price != null
                                        ? product.price.toFixed(2)
                                        : "0.00"}
                                  </div>
                                  {product.salePrice != null &&
                                    product.salePrice > 0 && (
                                      <div className="text-xs text-red-600 line-through">
                                        ₹{product.price != null ? product.price.toFixed(2) : "0.00"}
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                  {product.isActive ? "ACTIVE" : "INACTIVE"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() =>
                                      openProductViewModal(product)
                                    }
                                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <FiEye size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openProductEditModal(product)
                                    }
                                    className="p-1.5 text-[#8FAE8B] hover:text-[#7E9F7A] hover:bg-[#8FAE8B]/10 rounded"
                                    title="Edit"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleViewReviews(product.id, product.name)
                                    }
                                    className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                                    title="View Reviews"
                                  >
                                    <FiMessageSquare size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleToggleStatus(
                                        product.id,
                                        product.isActive,
                                      )
                                    }
                                    className={`p-1.5 rounded ${product.isActive ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"}`}
                                    title={
                                      product.isActive
                                        ? "Deactivate"
                                        : "Activate"
                                    }
                                  >
                                    {product.isActive ? (
                                      <FiPause size={16} />
                                    ) : (
                                      <FiPlay size={16} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              {loading
                                ? "Loading products..."
                                : "No products found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* --- PAGINATION & ROWS PER PAGE --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * rowsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        page * rowsPerPage,
                        activeTab === "CATEGORY"
                          ? filteredCategories?.length || 0
                          : activeTab === "SUBCATEGORY"
                            ? filteredSubCategories?.length || 0
                            : filteredProducts?.length || 0,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {activeTab === "CATEGORY"
                        ? filteredCategories?.length || 0
                        : activeTab === "SUBCATEGORY"
                          ? filteredSubCategories?.length || 0
                          : filteredProducts?.length || 0}
                    </span>{" "}
                    results
                  </p>
                </div>
              </div>

              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === i + 1
                          ? "z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal !== "NONE" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="backdrop-overlay"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200"
              >
                {/* PRODUCT VIEW MODAL */}
                {activeModal === "PRODUCT_VIEW" && viewingProduct && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Product Details
                      </h2>
                      <button type="button" onClick={closeModal}>
                        <FiX
                          size={24}
                          className="text-gray-400 hover:text-gray-900"
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Product Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="label">Product Name</label>
                            <div className="input-field bg-gray-50 break-words">
                              {viewingProduct.name}
                            </div>
                          </div>
                          <div>
                            <label className="label">Description</label>

                            <div
                              className="input-field bg-gray-50 min-h-[100px] p-3 overflow-auto rich-text-content"
                              style={{
                                maxHeight: "300px",
                                lineHeight: "1.6",
                                fontFamily: "inherit",
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  viewingProduct.description ||
                                  "<span class='text-gray-400'>No description</span>",
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="label">Category</label>
                              <div className="input-field bg-gray-50 break-words">
                                {viewingProduct.category}
                              </div>
                            </div>
                            <div>
                              <label className="label">Subcategory</label>
                              <div className="input-field bg-gray-50 break-words">
                                {viewingProduct.subcategory}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rest of your view modal code remains the same... */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Pricing & Stock
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="label">Price</label>
                              <div className="input-field bg-gray-50">
                                ₹
                                {viewingProduct.price != null
                                  ? viewingProduct.price.toFixed(2)
                                  : "0.00"}
                              </div>
                            </div>
                            <div>
                              <label className="label">Sale Price</label>
                              <div className="input-field bg-gray-50 break-words">
                                {viewingProduct.salePrice != null &&
                                viewingProduct.salePrice > 0
                                  ? `₹${viewingProduct.salePrice.toFixed(2)}`
                                  : "Not on sale"}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="label">Stock</label>
                            <div className="input-field bg-gray-50">
                              {viewingProduct.stock}
                            </div>
                          </div>
                          <div>
                            <label className="label">Status</label>
                            <div
                              className={`px-3 py-2 rounded-lg break-words ${viewingProduct.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {viewingProduct.isActive ? "ACTIVE" : "INACTIVE"}
                            </div>
                          </div>
                        </div>

                        {/* Tags display in view mode */}
                        {viewingProduct.attributes &&
                          viewingProduct.attributes.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-lg font-semibold mb-2">
                                Attributes
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Sizes
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {viewingProduct.attributes
                                      ?.filter((attr: any) => attr.type === "SIZE")
                                      .map((attr: any, index: number) => (
                                        <div
                                          key={index}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
                                        >
                                          {attr.value}
                                        </div>
                                      ))}
                                    {viewingProduct.attributes?.filter(
                                      (attr: any) => attr.type === "SIZE",
                                    ).length === 0 && (
                                      <span className="text-gray-400 text-sm">
                                        No sizes specified
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Colors
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {viewingProduct.attributes
                                      ?.filter((attr: any) => attr.type === "COLOR")
                                      .map((attr: any, index: number) => (
                                        <div
                                          key={index}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#8FAE8B]/10 text-[#8FAE8B] rounded-full text-sm font-medium border border-[#8FAE8B]/30"
                                        >
                                          {attr.value}
                                        </div>
                                      ))}
                                    {viewingProduct.attributes?.filter(
                                      (attr: any) => attr.type === "COLOR",
                                    ).length === 0 && (
                                      <span className="text-gray-400 text-sm">
                                        No colors specified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Images and Videos in view mode */}
                    <div className="space-y-6">
                      {viewingProduct.images &&
                        viewingProduct.images.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Product Images
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                              {viewingProduct.images.map((img, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square"
                                >
                                  <img
                                    src={getImageUrl(img)}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {viewingProduct.videos &&
                        viewingProduct.videos.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Product Videos
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {viewingProduct.videos.map((video, index) => {
                                const videoUrl = getVideoUrl(video);
                                return videoUrl ? (
                                  <div
                                    key={index}
                                    className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                                  >
                                    <video
                                      src={videoUrl}
                                      className="w-full h-full object-cover"
                                      controls
                                      preload="metadata"
                                    />
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* PRODUCT EDIT/CREATE MODAL */}
                {activeModal === "PRODUCT" && (
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </h2>
                      <button type="button" onClick={closeModal}>
                        <FiX
                          size={24}
                          className="text-gray-400 hover:text-gray-900"
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={productForm.name}
                          onChange={handleProductInputChange}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Category *</label>
                        <select
                          name="category"
                          value={productForm.category}
                          onChange={handleProductInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories &&
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Subcategory *</label>
                        <select
                          name="subcategory"
                          value={productForm.subcategory}
                          onChange={handleProductInputChange}
                          className="input-field"
                          required
                          disabled={!productForm.category}
                        >
                          <option value="">Select Subcategory</option>
                          {availableSubCategories?.map((sub) => (
                            <option key={sub.id} value={sub.name}>
                              {sub.name}
                            </option>
                          )) || []}
                        </select>
                      </div>
                      <div>
                        <label className="label">Stock *</label>
                        <input
                          type="number"
                          name="stock"
                          value={productForm.stock}
                          onChange={handleProductInputChange}
                          className="input-field"
                          required
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="label">Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductInputChange}
                          className="input-field"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Sale Price</label>
                        <input
                          type="number"
                          name="salePrice"
                          value={productForm.salePrice}
                          onChange={handleProductInputChange}
                          className="input-field"
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Tag inputs for sizes and colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TagInput
                        tags={sizeTags}
                        onTagsChange={setSizeTags}
                        label="Sizes"
                        placeholder="Type size and press Enter (e.g., S, M, L)"
                      />
                      <TagInput
                        tags={colorTags}
                        onTagsChange={setColorTags}
                        label="Colors"
                        placeholder="Type color and press Enter (e.g., Red, Black)"
                      />
                    </div>

                    <div>
                      <label className="label">Description *</label>
                      <RichTextEditor
                        value={productForm.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter product description..."
                      />
                    </div>

                    <div>
                      <label className="label">
                        Images <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center justify-center w-full mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {productForm.images.map((img, index) => (
                          <div
                            key={`exist-${index}`}
                            className="relative aspect-square"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt="Existing"
                              className="w-full h-full object-cover rounded-lg border border-[#8FAE8B]/50"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setProductForm((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== index,
                                  ),
                                }))
                              }
                              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                        {previewUrls.map((url, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative aspect-square"
                          >
                            <img
                              src={url}
                              alt="New Upload"
                              className="w-full h-full object-cover rounded-lg opacity-80"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Product Videos</label>
                      <div className="flex items-center justify-center w-full mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold">
                                Click or drag videos
                              </span>
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="video/*"
                            onChange={handleVideoChange}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {/* Existing videos */}
                        {productForm.videos.map((video, index) => {
                          const videoUrl = getVideoUrl(video);
                          return videoUrl ? (
                            <div
                              key={`exist-video-${index}`}
                              className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
                            >
                              <video
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                muted
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setProductForm((prev) => ({
                                    ...prev,
                                    videos: prev.videos.filter(
                                      (_, i) => i !== index,
                                    ),
                                  }))
                                }
                                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ) : null;
                        })}

                        {/* New video previews */}
                        {videoPreviewUrls.map((url, index) => (
                          <div
                            key={`new-video-${index}`}
                            className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden"
                          >
                            <video
                              src={url}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="btn-primary flex-1">
                        {editingProduct ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-ghost flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* CATEGORY MODAL */}
                {activeModal === "CATEGORY" && (
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </h2>
                      <button type="button" onClick={closeModal}>
                        <FiX
                          size={24}
                          className="text-gray-400 hover:text-gray-900"
                        />
                      </button>
                    </div>
                    <div>
                      <label className="label">Category Name *</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            description: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="btn-primary flex-1">
                        {editingCategory ? "Update" : "Create"} Category
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-ghost flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* SUBCATEGORY MODAL */}
                {activeModal === "SUBCATEGORY" && (
                  <form
                    onSubmit={handleSubCategorySubmit}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingSubCategory
                          ? "Edit Subcategory"
                          : "Add New Subcategory"}
                      </h2>
                      <button type="button" onClick={closeModal}>
                        <FiX
                          size={24}
                          className="text-gray-400 hover:text-gray-900"
                        />
                      </button>
                    </div>
                    <div>
                      <label className="label">Parent Category *</label>
                      <select
                        value={subCatForm.parentCategoryId}
                        onChange={(e) =>
                          setSubCatForm({
                            ...subCatForm,
                            parentCategoryId: e.target.value,
                          })
                        }
                        className="input-field"
                        required
                      >
                        <option value="">Select Parent Category</option>
                        {categories &&
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Subcategory Name *</label>
                      <input
                        type="text"
                        value={subCatForm.name}
                        onChange={(e) =>
                          setSubCatForm({ ...subCatForm, name: e.target.value })
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea
                        value={subCatForm.description}
                        onChange={(e) =>
                          setSubCatForm({
                            ...subCatForm,
                            description: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="btn-primary flex-1">
                        {editingSubCategory ? "Update" : "Create"} Subcategory
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-ghost flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* REVIEWS MODAL */}
                {activeModal === "REVIEWS" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-dark-900">
                          Product Reviews
                        </h2>
                        <p className="text-dark-600 mt-1">
                          {selectedProductName} • {totalReviews} review(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => selectedProductId && fetchProductReviews(selectedProductId, reviewPage)}
                          className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Refresh Reviews"
                          disabled={reviewsLoading}
                        >
                          <FiRefreshCw
                            className={reviewsLoading ? "animate-spin" : ""}
                            size={18}
                          />
                        </button>
                        <button onClick={closeModal}>
                          <FiX
                            size={24}
                            className="text-dark-400 hover:text-dark-900"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Review Filters */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-dark-500 mb-1 block">
                            Filter by Rating
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
                            value={reviewFilters.rating}
                            onChange={(e) => setReviewFilters(prev => ({ ...prev, rating: e.target.value }))}
                          >
                            <option value="">All Ratings</option>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <option key={rating} value={rating}>
                                {rating} Star{rating !== 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-dark-500 mb-1 block">
                            Sort by Date
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
                            value={reviewFilters.sortBy}
                            onChange={(e) => setReviewFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-dark-500 mb-1 block">
                            Search Reviews
                          </label>
                          <div className="relative">
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search by title, body, or username..."
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
                              value={reviewFilters.search}
                              onChange={(e) => setReviewFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {reviewsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FAE8B] mb-4"></div>
                          <p className="text-gray-600">Loading reviews...</p>
                        </div>
                      </div>
                    ) : filteredReviews.length === 0 ? (
                      <div className="text-center py-12 text-dark-500">
                        <FiMessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
                        <h3 className="text-xl font-medium mb-2">
                          No Reviews Found
                        </h3>
                        <p className="text-gray-600">
                          {reviewFilters.rating || reviewFilters.search 
                            ? "Try adjusting your filters" 
                            : "No reviews available for this product."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredReviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-gray-200 rounded-xl p-5 hover:border-[#8FAE8B]/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <FiUser className="text-gray-600" size={20} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-dark-900">
                                    {review.username || "Anonymous User"}
                                  </h4>
                                  <StarRating rating={review.rating} size={14} />
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  <FiCalendar className="inline mr-1" />
                                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                                </div>
                              </div>
                            </div>

                            {review.title && (
                              <h5 className="font-semibold text-dark-900 mb-2">
                                {review.title}
                              </h5>
                            )}

                            <p className="text-dark-700 mb-4">{review.body}</p>

                            {/* Display Images */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-dark-500 mb-2">Images:</p>
                                <div className="flex flex-wrap gap-2">
                                  {review.imageUrls.map((imageUrl, idx) => (
                                    <img
                                      key={idx}
                                      src={getMediaUrl(imageUrl)}
                                      alt={`Review image ${idx + 1}`}
                                      className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Display Videos */}
                            {review.videoUrls && review.videoUrls.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-dark-500 mb-2">Videos:</p>
                                <div className="flex flex-wrap gap-2">
                                  {review.videoUrls.map((_, idx) => (
                                    <div
                                      key={idx}
                                      className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
                                    >
                                      <FiVideo className="text-gray-400" size={24} />
                                      <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded">
                                        MP4
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                              >
                                <FiEdit2 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                              >
                                <FiTrash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Review Pagination */}
                        {totalReviews > reviewSize && (
                          <div className="flex justify-center items-center gap-2 pt-6">
                            <button
                              onClick={() => setReviewPage(prev => Math.max(0, prev - 1))}
                              disabled={reviewPage === 0}
                              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-600">
                              Page {reviewPage + 1} of {Math.ceil(totalReviews / reviewSize)}
                            </span>
                            <button
                              onClick={() => setReviewPage(prev => prev + 1)}
                              disabled={(reviewPage + 1) * reviewSize >= totalReviews}
                              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* --- EDIT REVIEW MODAL (Separate Modal) --- */}
      <AnimatePresence>
        {showEditReviewModal && editingReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditReviewModal(false)}
              className="backdrop-overlay"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">
                    Edit Review
                  </h2>
                  <button onClick={() => setShowEditReviewModal(false)}>
                    <FiX
                      size={24}
                      className="text-dark-400 hover:text-dark-900"
                    />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdateReview(); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-dark-500 mb-2 block">
                        Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, rating: star }))}
                            className="text-2xl"
                          >
                            <FiStar
                              className={`${star <= editForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-dark-500 mb-2 block">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B]"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter review title"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-dark-500 mb-2 block">
                        Review Body
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FAE8B] min-h-[120px]"
                        value={editForm.body}
                        onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Enter your review"
                      />
                    </div>

                    {/* Existing Images with Remove Option */}
                    {editingReview.imageUrls && editingReview.imageUrls.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-dark-500 mb-2 block">
                          Existing Images (Click X to remove)
                        </label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {editingReview.imageUrls.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={getMediaUrl(imageUrl)}
                                alt={`Review image ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  // Remove from display and add to removal list
                                  const updatedUrls = [...(editingReview.imageUrls || [])];
                                  updatedUrls.splice(index, 1);
                                  setEditingReview({...editingReview, imageUrls: updatedUrls});
                                  
                                  // Track removed images for backend
                                  const imageToRemove = editingReview.imageUrls![index];
                                  if (!removedImages.includes(imageToRemove)) {
                                    setRemovedImages([...removedImages, imageToRemove]);
                                  }
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Existing Videos with Remove Option */}
                    {editingReview.videoUrls && editingReview.videoUrls.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-dark-500 mb-2 block">
                          Existing Videos (Click X to remove)
                        </label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {editingReview.videoUrls.map((_, index) => (
                            <div key={index} className="relative group">
                              <div className="h-24 w-24 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                                <FiVideo className="text-gray-400 mb-1" size={24} />
                                <span className="text-xs text-gray-600">Video {index + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  // Remove from display and add to removal list
                                  const updatedUrls = [...(editingReview.videoUrls || [])];
                                  updatedUrls.splice(index, 1);
                                  setEditingReview({...editingReview, videoUrls: updatedUrls});
                                  
                                  // Track removed videos for backend
                                  const videoToRemove = editingReview.videoUrls![index];
                                  if (!removedVideos.includes(videoToRemove)) {
                                    setRemovedVideos([...removedVideos, videoToRemove]);
                                  }
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Images */}
                    <div>
                      <label className="text-sm font-semibold text-dark-500 mb-2 block">
                        Add New Images (Optional)
                      </label>
                      <div className="mb-4">
                        <input
                          id="edit-review-images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setEditImages(prev => [...prev, ...files]);
                            
                            // Create preview URLs
                            const newPreviews = files.map(file => URL.createObjectURL(file));
                            setEditImagePreviews(prev => [...prev, ...newPreviews]);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="edit-review-images"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold">Click to upload images</span>
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {/* New Image Previews */}
                      {editImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {editImagePreviews.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`New image ${index + 1}`}
                                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditImages(prev => prev.filter((_, i) => i !== index));
                                  setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add New Videos */}
                    <div>
                      <label className="text-sm font-semibold text-dark-500 mb-2 block">
                        Add New Videos (Optional)
                      </label>
                      <div className="mb-4">
                        <input
                          id="edit-review-videos"
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setEditVideos(prev => [...prev, ...files]);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="edit-review-videos"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiVideo className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold">Click to upload videos</span>
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Video file list */}
                      {editVideos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Selected videos: {editVideos.map((file, idx) => (
                              <span key={idx} className="inline-block mr-2">
                                {file.name}
                                <button
                                  type="button"
                                  onClick={() => setEditVideos(prev => prev.filter((_, i) => i !== idx))}
                                  className="ml-1 text-red-500"
                                >
                                  <FiX size={12} />
                                </button>
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A]"
                      >
                        Update Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditReviewModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .label { 
          @apply text-sm font-semibold text-gray-700 mb-2 block; 
        }
        .input-field {
          @apply w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] outline-none transition-colors;
        }
        .btn-primary {
          @apply px-6 py-2 bg-[#8FAE8B] text-white font-semibold rounded-lg hover:bg-[#7E9F7A] transition-colors;
        }
        .btn-ghost {
          @apply px-6 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors;
        }
        .backdrop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.48);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 60;
        }
        
        /* Rich Text Editor Specific Styles */
        .rich-text-editor {
          line-height: 1.6;
          font-family: inherit;
        }
        
        .rich-text-editor:empty::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        
        .rich-text-editor h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-editor h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-editor h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-editor p {
          margin-bottom: 1rem;
        }
        
        .rich-text-editor ul,
        .rich-text-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .rich-text-editor ul {
          list-style-type: disc;
        }
        
        .rich-text-editor ol {
          list-style-type: decimal;
        }
        
        .rich-text-editor li {
          margin-bottom: 0.25rem;
        }
        
        .rich-text-editor strong,
        .rich-text-editor b {
          font-weight: bold;
        }
        
        .rich-text-editor em,
        .rich-text-editor i {
          font-style: italic;
        }
        
        .rich-text-editor u {
          text-decoration: underline;
        }
        
        /* Rich text content display */
        .rich-text-content {
          line-height: 1.6;
        }
        
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3 {
          @apply font-bold mt-2 mb-1;
        }
        
        .rich-text-content h1 {
          @apply text-xl;
        }
        
        .rich-text-content h2 {
          @apply text-lg;
        }
        
        .rich-text-content h3 {
          @apply text-base;
        }
        
        .rich-text-content ul,
        .rich-text-content ol {
          @apply pl-5 my-2;
        }
        
        .rich-text-content ul {
          @apply list-disc;
        }
        
        .rich-text-content ol {
          @apply list-decimal;
        }
        
        .rich-text-content strong {
          @apply font-bold;
        }
        
        .rich-text-content em {
          @apply italic;
        }
        
        .rich-text-content u {
          @apply underline;
        }
        
        .rich-text-content a {
          @apply text-blue-600 hover:underline;
        }
      `}</style>
    </div>
  );
};

export default AdminProducts;
