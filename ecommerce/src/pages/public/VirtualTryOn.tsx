import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUploadCloud, FiRefreshCw, FiDownload, FiTrash2 } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { productApi } from '../../api/productApi';
import toast from 'react-hot-toast';
import { uploadImageToLightX, uploadUrlToLightX, generateTryOn } from '../../api/lightxApi';
import { useAuth } from '../../hooks/useAuth';
import VirtualTryOnLoader from '../../components/public/VirtualTryOnLoader';

const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
  return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const VirtualTryOn = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to use Virtual Try On");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [productImage, setProductImage] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productApi.getProductById(Number(id));
      if (data && data.images && data.images.length > 0) {
        setProductImage(getImageUrl(data.images[0]));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  };

  const isLocalUrl = (url: string) => {
    return url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.') || url.includes('10.');
  };

  const handleGenerate = async () => {
    if (!userFile) {
      toast.error('Please upload your image first.');
      return;
    }
    if (!productImage) {
      toast.error('Product image not available.');
      return;
    }


    setIsGenerating(true);
    const loadingToast = toast.loading('Uploading and generating try-on... Please wait (this can take up to 90 seconds).');

    try {
      // 1. Upload user image
      const personImageUrl = await uploadImageToLightX(userFile);

      // 2. Upload product image if it's hosted locally
      let garmentImageUrl = productImage;
      if (isLocalUrl(productImage)) {
        garmentImageUrl = await uploadUrlToLightX(productImage);
      }

      // 3. Generate try-on
      const outputUrl = await generateTryOn(personImageUrl, garmentImageUrl);
      setResultImage(outputUrl);
      toast.success('Generated successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate try-on.');
    } finally {
      setIsGenerating(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-6xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-sage transition-colors mb-8"
        >
          <FiArrowLeft />
          <span>Back to Product</span>
        </motion.button>
        
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">
            Virtual Try On
          </h1>
          
          {isGenerating ? (
            <VirtualTryOnLoader
              open={isGenerating}
              productImage={productImage ?? ''}
              userImage={userImage}
              productName="your outfit"
              onCancel={() => setIsGenerating(false)}
            />
          ) : resultImage ? (
            <div className="max-w-md mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Try-On Result</h2>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-border bg-gray-50 flex items-center justify-center p-2">
                <img src={resultImage} alt="Try-On Result" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={resultImage}
                  download="try-on-result.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#6B7D60] via-[#7A8D6D] to-[#6B7D60] hover:from-[#5E6E54] hover:to-[#6B7D60] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-[#6B7D60]/20"
                >
                  <FiDownload /> Download Image
                </a>
                <button
                  onClick={() => setResultImage(null)}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Box: Upload User Image */}
                <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
                  {userImage ? (
                    <>
                      <img src={userImage} alt="User" className="w-full h-full object-contain rounded-xl" />
                      <button
                        onClick={() => {
                          setUserImage(null);
                          setUserFile(null);
                        }}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-red-500 hover:bg-white hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-100">
                        Change Image
                        <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleUserImageUpload} />
                      </label>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <FiUploadCloud className="w-10 h-10 text-[#6B7D60] mb-4" />
                      <span className="font-semibold text-gray-800 mb-1">Upload Your Image</span>
                      <span className="text-sm text-gray-400">JPEG, PNG</span>
                      <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleUserImageUpload} />
                    </label>
                  )}
                </div>

                {/* Right Box: Dress Image (Fixed) */}
                <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 bg-gray-50">
                  {loading ? (
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  ) : productImage ? (
                    <img src={productImage} alt="Dress" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FiUploadCloud className="w-10 h-10 mb-4" />
                      <span className="font-semibold mb-1">Product Image</span>
                      <span className="text-sm">Not Available</span>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`px-8 py-3 rounded-full text-white font-bold shadow-lg bg-gradient-to-r from-[#6B7D60] via-[#7A8D6D] to-[#6B7D60] hover:from-[#5E6E54] hover:to-[#6B7D60] hover:opacity-90 transition-all flex items-center justify-center mx-auto space-x-2 shadow-[#6B7D60]/20 ${
                  isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    <span>Generating Magic...</span>
                  </>
                ) : (
                  <span>✨ Generate Magic</span>
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VirtualTryOn;
