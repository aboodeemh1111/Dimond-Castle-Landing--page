type AnyRecord = Record<string, any>;

function sleep(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export const mockUser = { id: "1", name: "Admin", email: "admin@example.com" };
export const mockToken = "mock-token";

const mockBlogs = [
  {
    _id: "b1",
    title: "Welcome to Dimond Castle",
    status: "published",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "b2",
    title: "Supply Chain Excellence",
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
];

const mockPages = [
  { _id: "p1", path: "/", title: "Home", published: true, updatedAt: new Date().toISOString() },
  { _id: "p2", path: "/about", title: "About", published: false, updatedAt: new Date().toISOString() },
];

const mockMedia = [
  { _id: "m1", url: "/images/hero/hero1.png", type: "image" },
  { _id: "m2", url: "/images/logo/logo1.png", type: "image" },
];

const mockContacts = [
  { _id: "c1", name: "John Doe", email: "john@example.com", message: "Hello", seen: false, createdAt: new Date().toISOString() },
  { _id: "c2", name: "Fatima", email: "fatima@example.com", message: "Interested in services", seen: true, createdAt: new Date().toISOString() },
];

export async function mockPost<T = AnyRecord>(path: string, body?: AnyRecord): Promise<T> {
  await sleep();
  if (path === "/auth/login") {
    return { token: mockToken, user: mockUser } as unknown as T;
  }
  return {} as T;
}

export async function mockGet<T = AnyRecord>(path: string): Promise<T> {
  await sleep();
  switch (path) {
    case "/blogs":
      return mockBlogs as unknown as T;
    case "/pages":
      return mockPages as unknown as T;
    case "/media":
      return mockMedia as unknown as T;
    case "/contacts":
      return mockContacts as unknown as T;
    default:
      return [] as unknown as T;
  }
}

