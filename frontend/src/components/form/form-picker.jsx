import React, { useEffect, useState } from 'react'
import { getRandomImages } from '@/src/lib/api/unsplash';
import { Check, Loader2 } from 'lucide-react';
import { defaultImages } from '@/src/config/images';
import FormErrors from './form-errors';


const FormPicker = ({
    id,
    errors = null,
    isSubmitting = false,
    setValue
}, ref) => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
                // const fetchedImages = await getRandomImages();
                const fetchedImages = defaultImages;
                if (!fetchedImages) {
                    throw new Error('Error fetching images');
                }
                setImages(fetchedImages);
            } catch (error) {
                console.log(error);
                setImages([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchImages();
    }, []);


    const handleImageSelect = (image) => {
        if (isSubmitting) return;

        setSelectedImageId(image.id);
        // Manually setting the form value with setValue from react-hook-form
        setValue(id, `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`);
    };


    if (isLoading) {
        return (
            <div>
                <Loader2 className='h-6 w-6 text-primary animate-spin' />
            </div>
        )
    }

  return (
    <div className='relative'>
      <div className='grid grid-cols-3 gap-2 mb-2'>
        {images.map((image) => (
            <div
                key={image.id}
                className={`cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted ${
                    isSubmitting && "opacity-50 hover:opacity-50 cursor-auto"
                } ${
                    selectedImageId === image.id && "border-2 border-muted-foreground rounded-sm  "
                }`}
                onClick={() => {
                    handleImageSelect(image);
                }}
            >
                    <img
                        src={image.urls.thumb}
                        alt="Unsplash image"
                        className={`object-cover rounded-sm w-full h-full absolute inset-0 ${
                            selectedImageId === image.id && "p-[1px]"
                        }`}
                    />

                    {selectedImageId === image.id && (
                        <div className='absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center'>
                            <Check className='h-4 w-4 text-white' />
                        </div>
                    )}

                    <a
                        href={image.links.html}
                        target="_blank"
                        className='opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/10'
                    >
                        {image.user.name}
                    </a>
            </div>
        ))}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  )
}

export default FormPicker;
