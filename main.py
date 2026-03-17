import streamlit as st
from scrape import scrape_website

st.set_page_config(page_title="AI Web Scraper")

st.title("🌐 AI Web Scraper")

url = st.text_input("Enter the URL of the website:")

if st.button("Scrape Site"):
    if url:
        with st.spinner("Scraping the website... ⏳"):
            result = scrape_website(url)

        st.success("Scraping completed ✅")

        # Display extracted content
        st.text_area("Extracted Content", result, height=400)
    else:
        st.warning("Please enter a valid URL ⚠️")