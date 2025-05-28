FROM registry.cn-hangzhou.aliyuncs.com/dockerhub_mirror/nginx

VOLUME /tmp
ENV LANG en_US.UTF-8
ADD default.conf /etc/nginx/conf.d/
ADD dist/ /opt/code/aixin/
EXPOSE 80
EXPOSE 443