import streamlit as st
from scrape import scrape_website

st.set_page_config(page_title="AI Web Scraper")

st.title("🌐 AI Web Scraper")

# 🔄 Mode selection
mode = st.radio("Choose input type:", ["URL", "Idea (Search + Scrape)"])

user_input = st.text_input(
    "Enter URL or Idea:",
    placeholder="https://example.com OR edtech startups"
)

if st.button("Run"):
    if user_input:
        with st.spinner("Processing... ⏳"):
            result = scrape_website(user_input, mode)

        st.success("Done ✅")
        st.text_area("Results", result, height=400)
    else:
        st.warning("Please enter something ⚠️")