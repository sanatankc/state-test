import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import Nav from '../../components/Nav'
import duck from '../../duck'

const fetchTopicJourney = async topicId =>
  duck.query({
    query: gql`
      query {
        topic(id: "${topicId}") {
          id
          learningObjectives {
            id
            title
          }
        }
      }
  `,
    type: 'topicJourney/fetch',
    key: `fetchTopicJourney/${topicId}`
  })

const video = async () =>
  duck.query({
    query: gql`
      query {
        userVideos(
          filter: {
            and: [
              { user_some: { id: "cjuqrwv0r00001hwdwom6euo9" } }
              { topic_some: { id: "cjuvivrym00011hupi1yaydln" } }
            ]
          }
        ) {
          id
          topic {
            id
            title
            description
            videoTitle
            order
            thumbnail {
              id
              name
              uri
            }
            video {
              id
              name
              uri
            }
            videoSubtitle {
              id
              uri
              name
            }
            videoThumbnail {
              id
              uri
              name
            }
            description
            learningObjectives(filter: { status: published }) {
              id
              title
              videoStartTime
              thumbnail {
                id
                uri
                name
              }
            }
          }
          videoCurrentTime
          isBookmarked
          isLiked
          status
          nextComponent {
            learningObjective {
              id
            }
            nextComponentType
          }
        }
      }
    `,
    type: 'videopage/fetch'
  })

const quiz = async () =>
  duck.query({
    query: gql`
      query {
        userQuizs(
          filter: {
            and: [
              { user_some: { id: "cjuqrwv0r00001hwdwom6euo9" } }
              { topic_some: { id: "cjuvivrym00011hupi1yaydln" } }
              { quizStatus: incomplete }
            ]
          }
        ) {
          id
          topic {
            id
            order
          }
          user {
            id
            username
          }
          quiz {
            question {
              id
              order
              statement
              hint
              questionType
              difficulty
              assessmentType
              learningObjective {
                id
                order
              }
              layout
              layoutText
              status
              mcqOptions {
                statement
              }
              fibInputOptions {
                answers
              }
              fibBlocksOptions {
                statement
                displayOrder
              }
              arrangeOptions {
                statement
                displayOrder
              }
            }
            questionDisplayOrder
          }
          quizStatus
        }
      }
    `,
    type: 'quiz/fetch',
    key: 'cjuvivrym00011hupi1yaydln'
  })

const Root = () => {
  const fetchingYo = async () => {
    const data = await fetchTopicJourney('cjuvivrym00011hupi1yaydln')
    duck.merge(
      prevState => ({
        learningObjective: {}
      }),
      {
        key: 'fetchTopicJourney/cjuvivrym00011hupi1yaydln'
      }
    )
  }
  useEffect(() => {
    fetchingYo()
  }, [])
  return (
    <div>
      <Nav />
    </div>
  )
}

export default Root
