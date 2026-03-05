import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.order.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@eventify.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
      isApproved: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create organizer user
  const organizerPassword = await bcrypt.hash("organizer123", 12);
  const organizer = await prisma.user.create({
    data: {
      name: "Event Organizer",
      email: "organizer@eventify.com",
      hashedPassword: organizerPassword,
      role: "ORGANIZER",
      isApproved: true,
    },
  });
  console.log(`✅ Organizer created: ${organizer.email}`);

  // Create attendee user
  const attendeePassword = await bcrypt.hash("attendee123", 12);
  const attendee = await prisma.user.create({
    data: {
      name: "John Attendee",
      email: "attendee@eventify.com",
      hashedPassword: attendeePassword,
      role: "ATTENDEE",
      isApproved: true,
    },
  });
  console.log(`✅ Attendee created: ${attendee.email}`);

  // Create categories
  const categories = await Promise.all(
    [
      { name: "Music", slug: "music" },
      { name: "Technology", slug: "technology" },
      { name: "Business", slug: "business" },
      { name: "Sports", slug: "sports" },
      { name: "Arts & Culture", slug: "arts-culture" },
      { name: "Food & Drink", slug: "food-drink" },
      { name: "Health & Wellness", slug: "health-wellness" },
      { name: "Education", slug: "education" },
    ].map((cat) => prisma.category.create({ data: cat }))
  );
  console.log(`✅ ${categories.length} categories created`);

  // Create locations
  const locations = await Promise.all(
    [
      {
        name: "Grand Convention Center",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10001",
        lat: 40.7128,
        lng: -74.006,
      },
      {
        name: "Tech Hub Arena",
        address: "456 Innovation Blvd",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        zipCode: "94105",
        lat: 37.7749,
        lng: -122.4194,
      },
      {
        name: "Riverside Park Amphitheater",
        address: "789 Riverside Drive",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zipCode: "60601",
        lat: 41.8781,
        lng: -87.6298,
      },
      {
        name: "Downtown Arts Gallery",
        address: "321 Art Lane",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        zipCode: "90012",
        lat: 34.0522,
        lng: -118.2437,
      },
    ].map((loc) => prisma.location.create({ data: loc }))
  );
  console.log(`✅ ${locations.length} locations created`);

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Summer Music Festival 2026",
        slug: "summer-music-festival-2026",
        description:
          "Join us for the biggest music festival of the summer! Featuring live performances from top artists across multiple stages. Food vendors, art installations, and unforgettable experiences await.",
        status: "PUBLISHED",
        startDate: new Date("2026-07-15T10:00:00Z"),
        endDate: new Date("2026-07-17T23:00:00Z"),
        organizerId: organizer.id,
        categoryId: categories[0].id, // Music
        locationId: locations[2].id, // Chicago
        ticketTypes: {
          create: [
            {
              name: "General Admission",
              kind: "STANDARD",
              price: 49.99,
              quantity: 500,
              description: "Access to all main stages",
            },
            {
              name: "VIP Pass",
              kind: "VIP",
              price: 149.99,
              quantity: 100,
              description: "VIP lounge, front row access, complimentary drinks",
            },
            {
              name: "Early Bird",
              kind: "EARLY_BIRD",
              price: 29.99,
              quantity: 200,
              saleEnd: new Date("2026-06-01T23:59:59Z"),
              description: "Limited early bird pricing",
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Tech Conference 2026",
        slug: "tech-conference-2026",
        description:
          "A premier technology conference featuring keynotes, workshops, and networking opportunities. Learn from industry leaders about AI, cloud computing, and the future of tech.",
        status: "PUBLISHED",
        startDate: new Date("2026-09-20T09:00:00Z"),
        endDate: new Date("2026-09-22T18:00:00Z"),
        organizerId: organizer.id,
        categoryId: categories[1].id, // Technology
        locationId: locations[1].id, // San Francisco
        ticketTypes: {
          create: [
            {
              name: "Standard Pass",
              kind: "STANDARD",
              price: 199.99,
              quantity: 300,
              description: "Full conference access",
            },
            {
              name: "Workshop Bundle",
              kind: "VIP",
              price: 399.99,
              quantity: 50,
              description: "Conference + hands-on workshops",
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Community Art Fair",
        slug: "community-art-fair",
        description:
          "Celebrate local artists and craftspeople at our annual community art fair. Browse unique artworks, enjoy live demonstrations, and support local talent.",
        status: "PUBLISHED",
        startDate: new Date("2026-05-10T11:00:00Z"),
        endDate: new Date("2026-05-10T20:00:00Z"),
        organizerId: organizer.id,
        categoryId: categories[4].id, // Arts & Culture
        locationId: locations[3].id, // Los Angeles
        ticketTypes: {
          create: [
            {
              name: "Free Entry",
              kind: "FREE",
              price: 0,
              quantity: 1000,
              description: "Free admission for everyone",
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Startup Pitch Night",
        slug: "startup-pitch-night",
        description:
          "Watch innovative startups pitch their ideas to a panel of investors. Network with founders, VCs, and fellow entrepreneurs.",
        status: "PUBLISHED",
        startDate: new Date("2026-06-05T18:00:00Z"),
        endDate: new Date("2026-06-05T22:00:00Z"),
        organizerId: organizer.id,
        categoryId: categories[2].id, // Business
        locationId: locations[0].id, // New York
        ticketTypes: {
          create: [
            {
              name: "General Admission",
              kind: "STANDARD",
              price: 25.0,
              quantity: 200,
              description: "Access to pitch event and networking",
            },
            {
              name: "VIP Investor",
              kind: "VIP",
              price: 99.0,
              quantity: 30,
              description: "Reserved seating, meet the founders",
            },
          ],
        },
      },
    }),
  ]);
  console.log(`✅ ${events.length} events created`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📧 Test accounts:");
  console.log("   Admin:     admin@eventify.com     / admin123");
  console.log("   Organizer: organizer@eventify.com / organizer123");
  console.log("   Attendee:  attendee@eventify.com  / attendee123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
