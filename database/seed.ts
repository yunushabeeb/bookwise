import ImageKit from 'imagekit';
import dummyBooks from '../dummybooks.json';
import { config } from 'dotenv';
import { createDb } from './db';
import { books } from './schema';

config({
  path: '.env.local',
});

const db = createDb(process.env.DATABASE_URL!);

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.log(error);
  }
};

const seed = async () => {
  console.log('Seeding data...');
  try {
    for (const book of dummyBooks) {
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        '/books/covers',
      )) as string;
      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        '/books/videos',
      )) as string;

      await db.insert(books).values({ ...book, coverUrl, videoUrl });
      console.log('Seeding data...');
    }
  } catch (error) {
    console.log(error);
  }
};

seed();
