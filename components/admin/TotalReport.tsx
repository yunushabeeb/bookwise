import Image from 'next/image';
import { db } from '@/database/drizzle';
import { books, borrowRecords, users } from '@/database/schema';
import { and, gte, lt, sql } from 'drizzle-orm';

interface TotalReport {
  title: string;
  total: number;
  status: string;
  value: number;
}

const TotalReport = async () => {
  let totalReport = [] as TotalReport[];

  try {
    const startOfThisWeek = new Date();
    startOfThisWeek.setDate(
      startOfThisWeek.getDate() - startOfThisWeek.getDay(),
    );
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const [
      booksTotal,
      booksThisWeek,
      booksLastWeek,
      usersTotal,
      usersThisWeek,
      usersLastWeek,
      borrowedRecordsTotal,
      borrowedRecordsThisWeek,
      borrowedRecordsLastWeek,
    ] = await Promise.all([
      db.select({ total: sql<number>`COUNT(${books.id})` }).from(books),
      db
        .select({ total: sql<number>`COUNT(${books.id})` })
        .from(books)
        .where(gte(books.createdAt, startOfThisWeek)),
      db
        .select({ total: sql<number>`COUNT(${books.id})` })
        .from(books)
        .where(
          and(
            gte(books.createdAt, startOfLastWeek),
            lt(books.createdAt, startOfThisWeek),
          ),
        ),
      db.select({ total: sql<number>`COUNT(${users.id})` }).from(users),
      db
        .select({ total: sql<number>`COUNT(${users.id})` })
        .from(users)
        .where(gte(users.createdAt, startOfThisWeek)),
      db
        .select({ total: sql<number>`COUNT(${users.id})` })
        .from(users)
        .where(
          and(
            gte(users.createdAt, startOfLastWeek),
            lt(users.createdAt, startOfThisWeek),
          ),
        ),
      db
        .select({ total: sql<number>`COUNT(${borrowRecords.id})` })
        .from(borrowRecords),
      db
        .select({ total: sql<number>`COUNT(${borrowRecords.id})` })
        .from(borrowRecords)
        .where(gte(borrowRecords.createdAt, startOfThisWeek)),
      db
        .select({ total: sql<number>`COUNT(${borrowRecords.id})` })
        .from(borrowRecords)
        .where(
          and(
            gte(borrowRecords.createdAt, startOfLastWeek),
            lt(borrowRecords.createdAt, startOfThisWeek),
          ),
        ),
    ]);

    // Format the totalReport
    totalReport = [
      {
        title: 'Books',
        total: booksTotal[0]?.total ?? 0,
        status:
          (booksThisWeek[0]?.total ?? 0) > (booksLastWeek[0]?.total ?? 0)
            ? 'up'
            : 'down',
        value: booksThisWeek[0]?.total ?? 0,
      },
      {
        title: 'Users',
        total: usersTotal[0]?.total ?? 0,
        status:
          (usersThisWeek[0]?.total ?? 0) > (usersLastWeek[0]?.total ?? 0)
            ? 'up'
            : 'down',
        value: usersThisWeek[0]?.total ?? 0,
      },
      {
        title: 'Borrow Records',
        total: borrowedRecordsTotal[0]?.total ?? 0,
        status:
          (borrowedRecordsThisWeek[0]?.total ?? 0) >
          (borrowedRecordsLastWeek[0]?.total ?? 0)
            ? 'up'
            : 'down',
        value: borrowedRecordsThisWeek[0]?.total ?? 0,
      },
    ];
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex gap-4 flex-wrap mb-6">
      {totalReport.map(({ title, total, status, value }, index) => (
        <section
          className="space-y-2.5 p-5 bg-white rounded-xl min-w-fit flex-1 hover:bg-primary-admin/30"
          key={index}
        >
          <h6 className="font-medium text-base text-gray-400 tracking-tight flex gap-2.5 items-center">
            <span>{title}</span>
            <span className="flex gap-0.5 items-center">
              <Image
                src={
                  status === 'up'
                    ? '/icons/admin/caret-up.svg'
                    : '/icons/admin/caret-down.svg'
                }
                alt="decrease"
                width={18}
                height={18}
              />
              <span
                className={`${status === 'up' ? 'text-green-500' : 'text-red-500'}`}
              >
                {value}
              </span>
            </span>
          </h6>
          <h3 className="font-semibold text-3xl text-dark-400 tracking-tighter">
            {total}
          </h3>
        </section>
      ))}
    </div>
  );
};

export default TotalReport;
