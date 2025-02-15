import React, { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("Minhaj");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetch() {
      try {
        const name: { FullName: string } = (
          await axios.get(`${url}/api/name`, {
            headers: {
              accesstoken: localStorage.getItem("token"),
            },
          })
        ).data;
        console.log(name);
        setName(name.FullName);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  const url = import.meta.env.VITE_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const getUrl: { newUrl: string } = (
        await axios.post(
          `${url}/api/urlShortner`,
          { longUrl: longUrl },
          {
            headers: {
              accesstoken: localStorage.getItem("token"),
            },
          }
        )
      )?.data;
      const mockShortUrl = getUrl.newUrl;
      setShortUrl(mockShortUrl);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response && axiosError.response.data) {
        setError(axiosError.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to copy URL to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div
        onClick={() => (localStorage.removeItem("token"), navigate("/"))}
        className="w-full h-8 bg-green font-bold text-yellow-700"
      >
        Logout
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {name}! 👋</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Enter your long URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shortUrl && (
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium">Your shortened URL:</div>
              <div className="flex items-center gap-2">
                <Input value={shortUrl} readOnly className="flex-1" />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default URLShortener;
