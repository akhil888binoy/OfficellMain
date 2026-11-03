import { useEffect, useRef, useState } from "react";
import { MdOutlineAttachFile, MdOutlineCategory } from "react-icons/md"
import { RiBuilding2Line } from "react-icons/ri"
import axios from 'axios';
import CompanySearchBar from "../company/CompanySearchBar";
import { CompanySearchCard } from "../company/CompanySearchCard";
import { toast } from 'react-toastify';
import useVentStore from "../../store/ventStore";
import Shuffle from "../../styles/Shuffle";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { categories } from "../../utils/ventCategory";
import useCompanyVentStore from "../../store/companyventStore";
import useProfileVentStore from "../../store/profileventStore";
import useTrendingVentStore from "../../store/trendingventStore";
import usePostCompanyStore from "../../store/postcompanyStore";
import { countryName } from '../../utils/countryName';
import { PAGE_SIZE } from "../../utils/pagesize";
import { findPrivacyMatches } from '../../utils/privacyCheck';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

type PostCardProps = {
  timeline?: boolean;
  fixedCompany?: { id: string; type?: 'LOCAL' | 'MNC'; locations: Array<{ id: number; city: string | null; country: string }> };
  activeLocationId?: number | null;
};

const PostCard = ({ timeline = false, fixedCompany, activeLocationId }: PostCardProps) => {
  const navigate = useNavigate();

  const [skip, setSkip] = useState(0);
  const search = usePostCompanyStore((state)=>state.companySearch);
  const setSearch = usePostCompanyStore((state)=>state.setCompanySearch);
  const hasMore = usePostCompanyStore((state)=>state.scrollHasMore);
  const loading = usePostCompanyStore((state)=> state.scrollLoading);
  const loadingMore = usePostCompanyStore((state)=>state.scrollLoadinMore);
  const setLoading = usePostCompanyStore((state)=>state.addScrollLoading);
  const setLoadingMore = usePostCompanyStore((state)=>state.addScrollLoadingMore);
  const setHasMore = usePostCompanyStore((state)=> state.addHasMore);
  const [postloading, setPostLoading] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [openCategory , setOpenCategory] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [openMedia , setOpenMedia] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<File[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [openCompanies , setOpenCompanies] = useState(false);
  const [pendingCompanyId, setPendingCompanyId] = useState('');
  const companies = usePostCompanyStore((state) => state.companies);
  const post = useVentStore((state)=> state.post);
  const category = useVentStore((state)=> state.category);
  const company_id = useVentStore((state)=>state.company_id);
  const effectiveCompanyId = fixedCompany?.id ?? company_id;
  const [pickedCompany, setPickedCompany] = useState<PostCardProps['fixedCompany'] | null>(null);
  const postingCompany = fixedCompany ?? pickedCompany;
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const selectedMedia = useVentStore((state)=>state.selectedMedia);
  const categoryVent = useVentStore((state)=> state.scrollCategory);
  const categoryCompanyVent = usePostCompanyStore((state)=>state.scrollCategory);
  const categoryProfileVent = useProfileVentStore((state)=>state.scrollCategory);
  const addCompanies = usePostCompanyStore((state) => state.addCompanies);
  const addVent = useVentStore((state) => state.addVent);
  const addTrendingVent = useTrendingVentStore((state) => state.addVent);
  const addCompanyVent = useCompanyVentStore((state)=> state.addVent);
  const addProfileVent = useProfileVentStore((state)=>state.addVent);
  const addPost = useVentStore((state)=>state.addPost);
  const addCompanyId = useVentStore((state)=>state.addCompany_id);
  const addCategory = useVentStore((state)=>state.addCategory);
  const addSelectedMedia = useVentStore((state)=>state.addSelectedMedia);
  const addMediaType = useVentStore((state)=>state.addMediaType);
  const resetPost = useVentStore((state)=>state.resetPost);
  const resetCategory = useVentStore((state)=>state.resetCategory);
  const resetCompanyId = useVentStore((state)=>state.resetCompany_id);
  const resetSelectedMedia = useVentStore((state)=>state.resetSelectedMedia);
  const resetMediaType = useVentStore((state)=>state.restMediaType);
  const reset = usePostCompanyStore((state)=>state.reset);
  const submitPost = async () => {
    if (submittingRef.current) return;
    if (!post.trim()) { toast.error('Write a post first.'); return; }
    if (!category) { toast.error('Choose a topic.'); return; }
    if (!effectiveCompanyId) { toast.error('Choose a company.'); return; }
    if (findPrivacyMatches(post).some(match => match.blocking)) {
      toast.error('Remove email addresses, phone numbers, and exact dates before posting.');
      return;
    }
    submittingRef.current = true;
    try {
      setPostLoading(true)
      
      const formData = new FormData();
      formData.append('content', post);
      formData.append('company_id', effectiveCompanyId);
      if (postingCompany?.locations.some(location => String(location.id) === selectedLocationId)) formData.append('location_id', selectedLocationId);
      formData.append('category', category);
      selectedMedia.forEach(file => formData.append('file', file));
      const  {data: response} = await axios.post(`${import.meta.env.VITE_API}/vents`, formData, {
          withCredentials: true
      });
      setPostLoading(false);

    if ((categoryVent === category || categoryVent === "") && (useVentStore.getState().scrollSort ?? 'new') === 'new') {
      addVent(response.vent);
    }

    if ((categoryCompanyVent === category || categoryCompanyVent === "") && (!activeLocationId || Number(selectedLocationId) === activeLocationId)) {
      addCompanyVent(response.vent);
    }

    if (categoryProfileVent === category || categoryProfileVent === "") {
      addProfileVent(response.vent);
    }
      addTrendingVent(response.vent);
      resetPost();
      resetCompanyId();
      resetCategory();
      resetSelectedMedia();
      resetMediaType();
      setSelectedLocationId("");

        toast.success('Post published.');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.code === 'USERNAME_REQUIRED') {
        setPostLoading(false);
        navigate('/username');
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setPostLoading(false);
        navigate('/sessionexpired');
        return;
      }
      const responseMessage = axios.isAxiosError(error) && [400, 413, 422].includes(error.response?.status ?? 0) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : null;
      toast.error(responseMessage || 'Could not publish the post. Try again.');
      setPostLoading(false);
    } finally {
      submittingRef.current = false;
    }
  }

  useEffect(() => { setSelectedLocationId(""); }, [effectiveCompanyId]);
  useEffect(() => {
    if (fixedCompany?.id || !company_id) { setPickedCompany(null); return; }
    setPickedCompany(null);
    const controller = new AbortController();
    axios.get(`${import.meta.env.VITE_API}/companies/${company_id}`, { withCredentials: true, signal: controller.signal })
      .then(({ data }) => setPickedCompany(data.company ? { id: String(data.company.id), type: data.company.type, locations: data.company.locations ?? [] } : null))
      .catch(error => { if (!axios.isCancel(error)) setPickedCompany(null); });
    return () => controller.abort();
  }, [fixedCompany?.id, company_id]);

  useEffect(() => {
    if (!openMedia || pendingMedia.length === 0) { setPendingPreviewUrls([]); return; }
    const urls = pendingMedia.map(file => URL.createObjectURL(file));
    setPendingPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [openMedia, pendingMedia]);

  const openAttachmentPicker = () => {
    const currentFiles = selectedMedia.filter(file => file instanceof File);
    if (currentFiles.length !== selectedMedia.length) { resetSelectedMedia(); resetMediaType(); }
    setPendingMedia(currentFiles);
    setMediaError('');
    setOpenMedia(true);
  };

const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []);
  if (!files.length) return;
  e.target.value = '';

  if (files.some(file => !['image/jpeg', 'image/png', 'image/webp', 'video/mp4'].includes(file.type))) {
    setMediaError('Choose a JPEG, PNG, WebP, or MP4 file.');
    return;
  }
  if (files.some(file => file.type !== 'video/mp4' && file.size > 5 * 1024 * 1024)) {
    setMediaError('Photos must be 5 MB or smaller.');
    return;
  }
  if (files.some(file => file.type === 'video/mp4' && file.size > 50 * 1024 * 1024)) {
    setMediaError('Videos must be 50 MB or smaller.');
    return;
  }
  const combined = (pendingMedia.length === 1 && pendingMedia[0].type === 'video/mp4' && files.length === 1 && files[0].type === 'video/mp4' ? files : [...pendingMedia, ...files]).filter((file, index, all) =>
    all.findIndex(other => other.name === file.name && other.size === file.size && other.lastModified === file.lastModified) === index
  );
  if (combined.some(file => file.type === 'video/mp4') && combined.length > 1) {
    setMediaError('Attach one video or up to four photos. Remove the other files first.');
    return;
  }
  if (combined.length > 4) {
    setMediaError('You can attach up to four photos.');
    return;
  }
  setMediaError('');
  setPendingMedia(combined);

};

  const saveAttachment = () => {
    if (pendingMedia.length) {
      addSelectedMedia(pendingMedia);
      addMediaType(pendingMedia[0].type === 'video/mp4' ? 'VIDEO' : 'IMAGE');
    } else {
      resetSelectedMedia();
      resetMediaType();
    }
    setOpenMedia(false);
  };


  const openTopicPicker = () => {
    setPendingCategory(category);
    setOpenCategory(true);
  };

  const openCompanyPicker = () => {
    setPendingCompanyId(company_id);
    setSkip(0);
    usePostCompanyStore.setState({
      companySearch: "",
      companies: [],
      scrollHasMore: true,
      scrollLoading: true,
      scrollLoadinMore: false,
    });
    setError(null);
    setOpenCompanies(true);
  };

  useEffect(() => {
    if (!openCompanies) return;
    const controller = new AbortController();
    const fetchCompanies = async () => {
      try {
        if (companies.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        

        const params = new URLSearchParams({ skip: String(skip), company_name: search });
        const { data: companiesJson } = await axios.get(`${import.meta.env.VITE_API}/companies?${params}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        
        const newCompanies = companiesJson.companies;
        if (newCompanies.length < PAGE_SIZE) {
                  setHasMore(false);  
              }
          if (newCompanies.length > 0) {
              addCompanies(newCompanies);
          }
        setError(null);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
          setError("Could not load companies. Please try again.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    if (hasMore || companies.length === 0 || search.length > 0) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },500);
      return () => { clearTimeout(timer); controller.abort(); };
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCompanies, skip, search]);

  
  return (

    <div className={timeline ? "w-full border-b border-gray-800 bg-gray-950" : "w-full bg-gray-950"}>
      {/* Input */}
      {postloading ? 
      <div className="flex justify-center items-center py-6 w-full">
                    <Shuffle
                      text="splling the tea"
                      className="font-arimo text-white font-bold tracking-[-0.001em] text-xl"
                      shuffleDirection="right"
                      duration={0.35}
                      animationMode="evenodd"
                      shuffleTimes={1}
                      ease="power3.out"
                      stagger={0.03}
                      threshold={0.1}
                      loop={true}
                      respectReducedMotion={true}
                    />
                  </div>
            : 
      <>
      {timeline ? (<>
      <div className="flex gap-3 px-4 pt-3 sm:px-5">
        <div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-base font-medium text-gray-300">?</div>
        <div className="min-w-0 flex-1">
          <label htmlFor="feed-post" className="sr-only">Write a post under your username</label>
          <textarea id="feed-post" rows={2} maxLength={1000} value={post} onChange={e=>addPost(e.target.value)} placeholder="What’s happening at work?" className="block w-full resize-y bg-transparent pt-1 text-base leading-6 text-white placeholder:text-gray-500 focus:outline-none" />
          {(effectiveCompanyId || category || selectedMedia.length > 0) && <div className="flex flex-wrap gap-2 pb-2 text-xs text-gray-300">{effectiveCompanyId && <span className="rounded-full border border-gray-700 px-2.5 py-0.5">Company selected</span>}{category && <span className="rounded-full border border-gray-700 px-2.5 py-0.5">{category}</span>}{selectedMedia.length > 0 && <span className="rounded-full border border-gray-700 px-2.5 py-0.5">{selectedMedia[0].type === 'video/mp4' ? 'Video attached' : `${selectedMedia.length} ${selectedMedia.length === 1 ? 'photo' : 'photos'} attached`}</span>}</div>}
          {postingCompany && (postingCompany.type === 'MNC' ? postingCompany.locations.length > 0 : postingCompany.locations.length > 1) && <div className="mb-2">
            <label htmlFor="post-location" className="mb-1 block text-xs text-gray-400">{postingCompany.type === 'MNC' ? 'Country tag (optional)' : 'Location tag (optional)'}</label>
            <select id="post-location" value={selectedLocationId} onChange={event => setSelectedLocationId(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200">
              <option value="">Company-wide — no {postingCompany.type === 'MNC' ? 'country' : 'location'} tag</option>
              {postingCompany.locations.map(location => <option key={location.id} value={location.id}>{postingCompany.type === 'MNC' ? countryName(location.country) : `${location.city}, ${location.country}`}</option>)}
            </select>
            <p className="mt-1 text-xs text-gray-500">Choose a {postingCompany.type === 'MNC' ? 'country' : 'city'} only if it will not identify you in a small team.</p>
          </div>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pb-3 pl-14 pr-4 pt-2 sm:pl-16 sm:pr-5">
        <div className="flex gap-1">
          <button type="button" aria-label="Add an attachment" title="Add an attachment" onClick={openAttachmentPicker} className={`flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-800 ${selectedMedia.length ? 'text-white' : 'text-gray-400'}`}><MdOutlineAttachFile className="text-lg" /></button>
          {!fixedCompany && <button type="button" aria-label="Choose a company" title="Choose a company" onClick={openCompanyPicker} className={`flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-800 ${company_id ? 'text-white' : 'text-gray-400'}`}><RiBuilding2Line className="text-lg" /></button>}
          <button type="button" aria-label="Choose a topic" title="Choose a topic" onClick={openTopicPicker} className={`flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-800 ${category ? 'text-white' : 'text-gray-400'}`}><MdOutlineCategory className="text-lg" /></button>
        </div>
        <div className="flex items-center gap-2"><span className="text-xs text-gray-500">{post.length}/1000</span><button type="button" onClick={submitPost} disabled={postloading} className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 disabled:opacity-50">Post</button></div>
      </div>
      </>) : (<>
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
        <input maxLength={1000} value={post} onChange={e=>addPost(e.target.value)} placeholder="Spill the tea..." className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base" />
        {post.length > 1000 ? 'only ': ''}
      </div>

       {/* Action Row */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-10 pb-3 pt-3 border-gray-950 border-b">
        <div className="flex gap-x-2 sm:gap-x-3">
          <button type="button" onClick={openAttachmentPicker} className={`flex items-center justify-center rounded-full p-1.5 transition hover:bg-gray-800 active:scale-95 sm:p-2 ${selectedMedia.length ? 'bg-gray-50 text-gray-950' : 'text-white'}`}><MdOutlineAttachFile className="text-base sm:text-lg" /></button>
          {!fixedCompany && <button type="button" onClick={openCompanyPicker} className={`flex items-center justify-center rounded-full p-1.5 transition hover:bg-gray-800 active:scale-95 sm:p-2 ${company_id ? 'bg-gray-50 text-gray-950' : 'text-white'}`}><RiBuilding2Line className="text-base sm:text-lg" /></button>}
          <button type="button" onClick={openTopicPicker} className={`flex items-center justify-center rounded-full p-1.5 transition hover:bg-gray-800 active:scale-95 sm:p-2 ${category ? 'bg-gray-50 text-gray-950' : 'text-white'}`}><MdOutlineCategory className="text-base sm:text-lg" /></button>
        </div>
        {/* Post Button */}
        <button type="button" onClick={submitPost} disabled={postloading} className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition disabled:opacity-50">
          Post
        </button>
      </div>
      </>)}
      </>
        
      }
    
      
    
<Dialog open={openMedia} onClose={setOpenMedia} className="relative z-30">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-black/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-10 flex items-start justify-center overflow-y-auto p-3 pt-10 sm:p-6 sm:pt-16">
    <DialogPanel
      transition
      className="relative mx-auto flex w-full max-w-lg transform flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-xl transition-all
        data-closed:translate-y-4 data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out 
        data-leave:duration-200 data-leave:ease-in 
        data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      <div className="border-b border-gray-800 px-4 py-4 sm:px-5">
        <DialogTitle className="text-base font-semibold text-white">Add photos or a video</DialogTitle>
        <p className="mt-1 text-xs text-gray-400">Up to 4 photos (5 MB each), or 1 MP4 video (50 MB)</p>
      </div>
      <div className="max-h-[65vh] space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        <input ref={mediaInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4" onChange={handleAddMedia} className="sr-only" tabIndex={-1} />
        <button
          type="button"
          onClick={() => mediaInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
        >
          <MdOutlineAttachFile className="text-base" aria-hidden="true" />{pendingMedia[0]?.type === 'video/mp4' ? 'Replace video' : pendingMedia.length ? 'Add more photos' : 'Choose files'}
        </button>
        {mediaError && <p role="alert" className="text-sm text-red-400">{mediaError}</p>}
        {pendingMedia.length > 0 && <div className="grid grid-cols-2 gap-3 border-t border-gray-800 pt-4">
          {pendingMedia.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="min-w-0 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
            {pendingPreviewUrls[index] && (file.type === 'video/mp4'
              ? <video src={pendingPreviewUrls[index]} controls className="aspect-video w-full object-contain">Your browser does not support the video tag.</video>
              : <img src={pendingPreviewUrls[index]} alt={`Photo ${index + 1} preview`} className="aspect-square w-full object-cover" />)}
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="min-w-0 truncate text-xs text-gray-300" title={file.name}>{file.name}</span>
              <button type="button" onClick={() => { setPendingMedia(current => current.filter((_, itemIndex) => itemIndex !== index)); setMediaError(''); }} aria-label={`Remove ${file.name}`} className="shrink-0 text-xs text-gray-400 hover:text-white">Remove</button>
            </div>
          </div>)}
        </div>}
        {!pendingMedia.length && selectedMedia.length > 0 && <p className="text-sm text-gray-400">The current attachments will be removed when you save.</p>}
        <p className="text-xs leading-5 text-gray-400">Check the file for faces, names, private messages, screens, and voices before posting.</p>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-gray-800 bg-gray-950 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setOpenMedia(false)}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-900"
        >
          Cancel
        </button>
        <button type="button" onClick={saveAttachment} disabled={!pendingMedia.length && !selectedMedia.length} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40">{pendingMedia.length ? 'Save attachments' : 'Remove attachments'}</button>
      </div>
    </DialogPanel>
  </div>
</Dialog>


<Dialog open={openCategory} onClose={setOpenCategory} className="relative z-30">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-black/80 transition-opacity
      data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out
      data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto p-3 pt-10 sm:p-6 sm:pt-16">
    <DialogPanel
      transition
      className="relative mx-auto flex w-full max-w-lg transform flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-xl transition-all
      data-closed:translate-y-4 data-closed:opacity-0
      data-enter:duration-300 data-enter:ease-out
      data-leave:duration-200 data-leave:ease-in
      data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      <div className="border-b border-gray-800 px-4 py-4 sm:px-5">
        <DialogTitle className="text-base font-semibold text-white">Choose a topic</DialogTitle>
      </div>

      <div className="max-h-[60vh] divide-y divide-gray-800 overflow-y-auto sm:max-h-[65vh]">
        {categories.map((cat) => (
          <button
            type="button"
            onClick={() => setPendingCategory(cat.name)}
            key={cat.name}
            aria-pressed={pendingCategory === cat.name}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-5 ${pendingCategory === cat.name ? 'bg-gray-900' : 'hover:bg-gray-900/70'}`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center text-base text-gray-400" aria-hidden="true">{cat.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">{cat.name}</span>
              <span className="mt-0.5 block truncate text-xs text-gray-400">{cat.description}</span>
            </span>
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${pendingCategory === cat.name ? 'border-white bg-white text-gray-950' : 'border-gray-600 text-transparent'}`} aria-hidden="true"><Check className="size-3" /></span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-800 bg-gray-950 px-4 py-3 sm:px-5">
        {category && <button type="button" onClick={() => { resetCategory(); setOpenCategory(false); }} className="mr-auto px-2 py-2 text-sm text-gray-400 hover:text-white">Clear topic</button>}
        <button
          type="button"
          onClick={() => setOpenCategory(false)}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { if (pendingCategory) addCategory(pendingCategory); setOpenCategory(false); }}
          disabled={!pendingCategory}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Choose
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>





 <Dialog open={openCompanies} onClose={setOpenCompanies} className="relative z-30">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-black/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-10 flex items-start justify-center overflow-y-auto p-3 pt-10 sm:p-6 sm:pt-16">
    <DialogPanel
      transition
      className="relative mx-auto flex w-full max-w-lg transform flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-xl
        transition-all
        data-closed:translate-y-4 data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out 
        data-leave:duration-200 data-leave:ease-in 
        data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      <div className="border-b border-gray-800 px-4 pb-4 pt-5 sm:px-5">
        <DialogTitle className="mb-3 text-base font-semibold text-white">Choose a company</DialogTitle>
          <CompanySearchBar compact
            search={search}
            onSearch={(q: string) => {
              setSkip(0);
              setHasMore(true);
              setPendingCompanyId('');
              reset();
              setSearch(q);
            }} 
          />
      </div>
      <div className="max-h-[55vh] flex-1 overflow-y-auto sm:max-h-[60vh]">
        {loading && companies.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-400">Searching companies…</p>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}

        {/* Companies list */}
        <div className="divide-y divide-gray-800">
          {companies.map((company) => (
              <CompanySearchCard
                key={company.id}
                type={company.type}
                isRemote={company.isRemote}
                company_name={company.name}
                industry={company.industry}
                city={company.city}
                region={company.region}
                country={company.country}
                domain={company.domain}
                logoUrl={company.logoUrl}
                selected={pendingCompanyId === company.id}
                onSelect={() => setPendingCompanyId(company.id)}
              />
          ))}
        </div>
        {!loading && !error && companies.length === 0 && <p className="px-4 py-8 text-center text-sm text-gray-400">No companies found.</p>}

        {/* Loading more */}
        {loadingMore && (
          <p className="px-4 py-4 text-center text-sm text-gray-400">Loading more…</p>
        )}

        <button type="button" onClick={() => navigate('/companies/register')} className="w-full border-t border-gray-800 px-4 py-4 text-left text-sm text-gray-300 hover:bg-gray-900 hover:text-white">Can't find your company? <span className="font-medium text-white">Add it</span></button>

        {/* End of results */}
        {!hasMore && companies.length > 0 && (
          <div className="px-4 py-3 text-center text-xs text-gray-500">End of results</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-800 bg-gray-950 px-4 py-3 sm:px-5">
        {!fixedCompany && company_id && <button type="button" onClick={() => { resetCompanyId(); setPickedCompany(null); setSelectedLocationId(''); setOpenCompanies(false); }} className="mr-auto px-2 py-2 text-sm text-gray-400 hover:text-white">Clear company</button>}

        <button
          type="button"
          onClick={() => {
            setOpenCompanies(false);
          }}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-900"
        >
          Cancel
        </button>
         <button
          type="button"
          onClick={() => { if (pendingCompanyId) addCompanyId(pendingCompanyId); setOpenCompanies(false); }}
          disabled={!pendingCompanyId}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Choose
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>





    </div>
  )
}

export default PostCard
