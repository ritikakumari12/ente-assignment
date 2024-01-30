"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import 'photoswipe/dist/photoswipe.css'
import './styles.css';

import { Gallery, Item } from 'react-photoswipe-gallery'

const options = {
  arrowPrev: false,
  arrowNext: false,
  zoom: false,
  close: false,
  counter: false,
  bgOpacity: 0.2,
  padding: { top: 20, bottom: 40, left: 100, right: 100 },
}


interface Image  {
  url: string;
  thumbnail: string;
  id: string;
}

export default function Home() {
  const[ lastId, setLastId ]  = useState('0')

  const [images, setImages] = useState<Image[]>([]);
  const [loaded, setIsLoaded] = useState(false);

  const fetchImages = async (lastId?: string | null | undefined) => {
    const after = "&after=t3_" + lastId;
    var url = "https://www.reddit.com/r/memes.json?limit=20";
    if (lastId != '0') {
      url += after;
    }

    const res = await axios.get(url);
    const data = await res.data;
    const image_array: { thumbnail: any; url: any; id: any }[] = [];
    setIsLoaded(true);
    const new_images: { thumbnail: any; url: any; id: any; }[] = [];
    data.data.children.map(
      (node: { data: { thumbnail: any; url: any; id: any } }) => {
        new_images.push({
          thumbnail: node.data.thumbnail,
          url: node.data.url,
          id: node.data.id,
        });
        setLastId( node.data.id);
      }
    );
    setImages([...images,...new_images])
    
  };

  useEffect(() => {
    fetchImages();
  }, []);

  console.log(loaded)
  console.log(images)

  return (
    <>
      <header>
        <h1>Memes Gallery</h1>
      </header>
      <InfiniteScroll
        dataLength={images.length}
        next={() => fetchImages(lastId)}
        hasMore={true}
        loader={
          <img
            src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
            alt="loading"
          />
        }
      >
        <Gallery options={options}>
        {loaded
            ? images.map((image) => (
              <Item
              original={image.url}
              thumbnail={image.thumbnail}
              width="10024"
              height="7068"
              key={image.id}
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} src={image.thumbnail} key={image.id}/>
              )}
            </Item>
              ))
            : ""}
        </Gallery>
        
      </InfiniteScroll>
    </>
  );
}